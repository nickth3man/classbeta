import { renderHook, act } from '@testing-library/react-hooks';
import useAssignmentTemplates from '../../src/hooks/useAssignmentTemplates';
import { ipcRenderer } from 'electron';

// Mock sample templates
const mockTemplates = [
  {
    id: 1,
    name: 'Lab Report',
    description: 'Weekly lab report template',
    defaults: JSON.stringify({
      title: 'Lab Report',
      description: 'Weekly lab report for [course]',
      course_id: 101,
      course_name: 'Biology 101'
    })
  },
  {
    id: 2,
    name: 'Research Paper',
    description: 'Final research paper template',
    defaults: JSON.stringify({
      title: 'Research Paper',
      description: 'Final paper for [course]',
      course_id: 201,
      course_name: 'Chemistry 201'
    })
  }
];

describe('useAssignmentTemplates hook', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  test('should load templates on initialization', async () => {
    // Mock successful template loading
    ipcRenderer.invoke.mockResolvedValue(mockTemplates);
    
    const { result, waitForNextUpdate } = renderHook(() => useAssignmentTemplates());
    
    // Initial loading state
    expect(result.current.loading).toBe(true);
    expect(result.current.templates).toEqual([]);
    
    await waitForNextUpdate();
    
    // After loading
    expect(result.current.loading).toBe(false);
    expect(result.current.templates).toHaveLength(2);
    expect(result.current.templates[0].name).toBe('Lab Report');
    expect(result.current.templates[1].name).toBe('Research Paper');
  });

  test('should handle template loading errors', async () => {
    // Mock template loading error
    ipcRenderer.invoke.mockRejectedValue(new Error('Database error'));
    
    const { result, waitForNextUpdate } = renderHook(() => useAssignmentTemplates());
    
    await waitForNextUpdate();
    
    expect(result.current.error).toBe('Failed to load assignment templates');
    expect(result.current.loading).toBe(false);
    expect(result.current.templates).toEqual([]);
  });

  test('should create a new template', async () => {
    const newTemplate = {
      name: 'Homework',
      description: 'Weekly homework template',
      defaults: JSON.stringify({
        title: 'Homework',
        description: 'Weekly homework for [course]',
        course_id: 301
      })
    };
    
    // Mock successful template creation
    ipcRenderer.invoke.mockResolvedValue({ ...newTemplate, id: 3 });
    
    const { result } = renderHook(() => useAssignmentTemplates());
    
    await act(async () => {
      await result.current.saveTemplate(newTemplate);
    });
    
    expect(result.current.templates).toHaveLength(1);
    expect(result.current.templates[0].name).toBe('Homework');
    expect(result.current.templates[0].id).toBe(3);
    
    // Verify database call
    expect(ipcRenderer.invoke).toHaveBeenCalledWith(
      'save-assignment-template',
      newTemplate
    );
  });

  test('should update an existing template', async () => {
    // Mock initial templates
    ipcRenderer.invoke.mockResolvedValue(mockTemplates);
    
    const { result, waitForNextUpdate } = renderHook(() => useAssignmentTemplates());
    await waitForNextUpdate();
    
    const updatedTemplate = {
      ...mockTemplates[0],
      name: 'Updated Lab Report'
    };
    
    // Mock successful template update
    ipcRenderer.invoke.mockResolvedValue(updatedTemplate);
    
    await act(async () => {
      await result.current.saveTemplate(updatedTemplate);
    });
    
    expect(result.current.templates[0].name).toBe('Updated Lab Report');
    expect(result.current.templates).toHaveLength(2);
    
    // Verify database call
    expect(ipcRenderer.invoke).toHaveBeenCalledWith(
      'save-assignment-template',
      updatedTemplate
    );
  });

  test('should delete a template', async () => {
    // Mock initial templates
    ipcRenderer.invoke.mockResolvedValue(mockTemplates);
    
    const { result, waitForNextUpdate } = renderHook(() => useAssignmentTemplates());
    await waitForNextUpdate();
    
    // Mock successful deletion
    ipcRenderer.invoke.mockResolvedValue({ success: true });
    
    await act(async () => {
      await result.current.deleteTemplate(1);
    });
    
    expect(result.current.templates).toHaveLength(1);
    expect(result.current.templates[0].id).toBe(2);
    
    // Verify database call
    expect(ipcRenderer.invoke).toHaveBeenCalledWith(
      'delete-assignment-template',
      1
    );
  });

  test('should create an assignment from a template', async () => {
    const mockAssignment = {
      id: 100,
      title: 'Lab Report',
      description: 'Weekly lab report for Biology 101',
      course_id: 101,
      created_from_template: 1
    };
    
    // Mock successful assignment creation
    ipcRenderer.invoke.mockResolvedValue(mockAssignment);
    
    const { result } = renderHook(() => useAssignmentTemplates());
    
    const createdAssignment = await act(async () => {
      return await result.current.createFromTemplate(1, {
        due_date: '2025-04-15'
      });
    });
    
    expect(createdAssignment).toEqual(mockAssignment);
    
    // Verify database call
    expect(ipcRenderer.invoke).toHaveBeenCalledWith(
      'create-assignment',
      expect.objectContaining({
        title: 'Lab Report',
        description: 'Weekly lab report for Biology 101',
        course_id: 101,
        created_from_template: 1,
        due_date: '2025-04-15'
      })
    );
  });

  test('should handle errors during template operations', async () => {
    // Mock error during template creation
    ipcRenderer.invoke.mockRejectedValue(new Error('Database error'));
    
    const { result } = renderHook(() => useAssignmentTemplates());
    
    await act(async () => {
      await result.current.saveTemplate({
        name: 'Test Template',
        defaults: '{}'
      });
    });
    
    expect(result.current.error).toBe('Failed to save assignment template');
  });
});
