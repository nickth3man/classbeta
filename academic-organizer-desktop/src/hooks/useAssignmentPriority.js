import { useState, useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';

/**
 * Custom hook to manage assignment priorities with drag-and-drop functionality
 * @param {Array} assignments - List of assignments to manage priorities for
 * @returns {Object} - Priority management methods and state
 */
const useAssignmentPriority = (assignments) => {
  const [prioritizedAssignments, setPrioritizedAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Initialize prioritized assignments whenever the assignments list changes
  useEffect(() => {
    if (assignments && assignments.length > 0) {
      // Sort assignments by priority (lower number = higher priority)
      const sorted = [...assignments].sort((a, b) => {
        // If priorities are the same, sort by due date
        if (a.priority === b.priority) {
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date) - new Date(b.due_date);
        }
        return a.priority - b.priority;
      });
      
      // Assign sequential priorities if needed
      const withSequentialPriorities = sorted.map((assignment, index) => ({
        ...assignment,
        priority: index + 1 // Start from 1 for better UX
      }));
      
      setPrioritizedAssignments(withSequentialPriorities);
    } else {
      setPrioritizedAssignments([]);
    }
  }, [assignments]);

  /**
   * Update assignment priorities in the database
   * @param {Array} updatedAssignments - Assignments with updated priorities
   */
  const updatePriorityInDb = useCallback(async (updatedAssignments) => {
    setLoading(true);
    setError(null);

    try {
      // Call the IPC handler to update priorities in the database
      const result = await ipcRenderer.invoke('update-assignment-priorities', updatedAssignments);
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to update priorities');
      }
      
      return true;
    } catch (err) {
      console.error('Error updating priorities:', err);
      setError('Failed to update assignment priorities');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Handle the end of a drag operation
   * @param {Object} event - DnD kit drag end event
   */
  const handleDragEnd = useCallback(async (event) => {
    const { active, over } = event;
    
    if (!over || active.id === over.id) {
      return; // No change in order
    }

    // Find the indices of the dragged item and the drop target
    const oldIndex = prioritizedAssignments.findIndex(item => item.id === active.id);
    const newIndex = prioritizedAssignments.findIndex(item => item.id === over.id);
    
    if (oldIndex === -1 || newIndex === -1) {
      return; // Invalid indices
    }

    // Create a new array with the updated order
    const updatedAssignments = [...prioritizedAssignments];
    const [movedItem] = updatedAssignments.splice(oldIndex, 1);
    updatedAssignments.splice(newIndex, 0, movedItem);
    
    // Update priorities based on new positions
    const withUpdatedPriorities = updatedAssignments.map((assignment, index) => ({
      ...assignment,
      priority: index + 1 // Start from 1 for better UX
    }));
    
    // Update state immediately for responsive UI
    setPrioritizedAssignments(withUpdatedPriorities);
    
    // Update priorities in the database
    await updatePriorityInDb(withUpdatedPriorities);
  }, [prioritizedAssignments, updatePriorityInDb]);

  /**
   * Reset priorities to default (based on due dates)
   */
  const resetPriorities = useCallback(async () => {
    if (!assignments || assignments.length === 0) {
      return;
    }
    
    // Sort assignments by due date
    const byDueDate = [...assignments].sort((a, b) => {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date);
    });
    
    // Assign sequential priorities
    const withResetPriorities = byDueDate.map((assignment, index) => ({
      ...assignment,
      priority: index + 1 // Start from 1 for better UX
    }));
    
    // Update state
    setPrioritizedAssignments(withResetPriorities);
    
    // Update in database
    await updatePriorityInDb(withResetPriorities);
  }, [assignments, updatePriorityInDb]);

  return {
    prioritizedAssignments,
    loading,
    error,
    handleDragEnd,
    resetPriorities
  };
};

export default useAssignmentPriority;
