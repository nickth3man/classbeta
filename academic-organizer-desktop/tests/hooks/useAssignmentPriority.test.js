import { renderHook, act } from '@testing-library/react-hooks';
import useAssignmentPriority from '../../src/hooks/useAssignmentPriority';
import { ipcRenderer } from 'electron';

// Mock sample assignments
const mockAssignments = [
  { id: 1, title: 'Assignment 1', priority: 3, due_date: '2025-04-15' },
  { id: 2, title: 'Assignment 2', priority: 1, due_date: '2025-03-25' },
  { id: 3, title: 'Assignment 3', priority: 2, due_date: '2025-04-01' },
  { id: 4, title: 'Assignment 4', priority: null, due_date: '2025-03-20' }
];

describe('useAssignmentPriority hook', () => {
  test('should initialize with sorted assignments', () => {
    const { result } = renderHook(() => useAssignmentPriority(mockAssignments));
    
    // Assignments should be sorted by priority
    expect(result.current.prioritizedAssignments).toHaveLength(4);
    expect(result.current.prioritizedAssignments[0].id).toBe(2); // Priority 1
    expect(result.current.prioritizedAssignments[1].id).toBe(3); // Priority 2
    expect(result.current.prioritizedAssignments[2].id).toBe(1); // Priority 3
    expect(result.current.prioritizedAssignments[3].id).toBe(4); // Null priority (should be last)
  });

  test('should handle empty assignments array', () => {
    const { result } = renderHook(() => useAssignmentPriority([]));
    
    expect(result.current.prioritizedAssignments).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  test('should sort by due date when priorities are equal', () => {
    const assignmentsWithEqualPriority = [
      { id: 1, title: 'Assignment 1', priority: 1, due_date: '2025-04-15' },
      { id: 2, title: 'Assignment 2', priority: 1, due_date: '2025-03-25' }
    ];
    
    const { result } = renderHook(() => useAssignmentPriority(assignmentsWithEqualPriority));
    
    // Should sort by due date when priorities are equal
    expect(result.current.prioritizedAssignments[0].id).toBe(2); // Earlier due date
    expect(result.current.prioritizedAssignments[1].id).toBe(1); // Later due date
  });

  test('should handle assignments without due dates', () => {
    const assignmentsWithoutDueDate = [
      { id: 1, title: 'Assignment 1', priority: 1, due_date: null },
      { id: 2, title: 'Assignment 2', priority: 1, due_date: '2025-03-25' }
    ];
    
    const { result } = renderHook(() => useAssignmentPriority(assignmentsWithoutDueDate));
    
    // Assignments without due dates should come after ones with due dates
    expect(result.current.prioritizedAssignments[0].id).toBe(2); // Has due date
    expect(result.current.prioritizedAssignments[1].id).toBe(1); // No due date
  });

  test('should handle drag end event and update priorities', async () => {
    // Mock successful database update
    ipcRenderer.invoke.mockResolvedValue({ success: true });
    
    const { result, waitForNextUpdate } = renderHook(() => useAssignmentPriority(mockAssignments));
    
    // Simulate drag end event (moving item with id 3 above item with id 2)
    act(() => {
      result.current.handleDragEnd({
        active: { id: 3 },
        over: { id: 2 }
      });
    });
    
    await waitForNextUpdate();
    
    // Check that the order was updated correctly
    const updatedAssignments = result.current.prioritizedAssignments;
    expect(updatedAssignments[0].id).toBe(3); // Now first (was third)
    expect(updatedAssignments[1].id).toBe(2); // Now second (was first)
    
    // Verify that priorities were updated
    expect(updatedAssignments[0].priority).toBe(1); // New priority 1
    expect(updatedAssignments[1].priority).toBe(2); // New priority 2
    
    // Verify that the database update was called with the correct parameters
    expect(ipcRenderer.invoke).toHaveBeenCalledWith(
      'update-assignment-priorities',
      expect.arrayContaining([
        expect.objectContaining({ id: 3, priority: 1 }),
        expect.objectContaining({ id: 2, priority: 2 })
      ])
    );
  });

  test('should handle database errors during priority update', async () => {
    // Mock database error
    ipcRenderer.invoke.mockRejectedValue(new Error('Database error'));
    
    const { result, waitForNextUpdate } = renderHook(() => useAssignmentPriority(mockAssignments));
    
    // Simulate drag end event
    act(() => {
      result.current.handleDragEnd({
        active: { id: 3 },
        over: { id: 2 }
      });
    });
    
    await waitForNextUpdate();
    
    // Should show error state
    expect(result.current.error).toBe('Failed to update assignment priorities');
    expect(result.current.loading).toBe(false);
  });

  test('should reset priorities based on due dates', async () => {
    // Mock successful database update
    ipcRenderer.invoke.mockResolvedValue({ success: true });
    
    const { result, waitForNextUpdate } = renderHook(() => useAssignmentPriority(mockAssignments));
    
    // Call resetPriorities
    act(() => {
      result.current.resetPriorities();
    });
    
    await waitForNextUpdate();
    
    // Priorities should be reset based on due dates
    const resetAssignments = result.current.prioritizedAssignments;
    
    // Should be sorted by due date
    expect(resetAssignments[0].id).toBe(4); // March 20
    expect(resetAssignments[1].id).toBe(2); // March 25
    expect(resetAssignments[2].id).toBe(3); // April 1
    expect(resetAssignments[3].id).toBe(1); // April 15
    
    // Priorities should be sequential
    expect(resetAssignments[0].priority).toBe(1);
    expect(resetAssignments[1].priority).toBe(2);
    expect(resetAssignments[2].priority).toBe(3);
    expect(resetAssignments[3].priority).toBe(4);
    
    // Verify database call
    expect(ipcRenderer.invoke).toHaveBeenCalledWith(
      'update-assignment-priorities',
      expect.arrayContaining([
        expect.objectContaining({ id: 4, priority: 1 }),
        expect.objectContaining({ id: 2, priority: 2 }),
        expect.objectContaining({ id: 3, priority: 3 }),
        expect.objectContaining({ id: 1, priority: 4 })
      ])
    );
  });
});
