import { useState } from 'react';

/**
 * Custom hook for managing assignment deletion dialog
 * @param {Function} refreshCallback - Function to call after successful deletion
 * @returns {Object} Delete dialog state and handlers
 */
export const useAssignmentsDeleteDialog = (refreshCallback) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  /**
   * Open the delete confirmation dialog for a specific assignment
   * @param {Object} assignment - The assignment to delete
   */
  const handleOpenDeleteDialog = (assignment) => {
    setSelectedAssignment(assignment);
    setOpenDeleteDialog(true);
  };

  /**
   * Handle the delete action
   * @param {Object} assignment - The assignment to delete
   */
  const handleDeleteAssignment = (assignment) => {
    if (!assignment) return;

    // Simulating assignment deletion from database
    console.log(`Deleting assignment: ${assignment.id}`);
    
    // In a real application, this would call the database
    // db.deleteAssignment(assignment.id)
    //   .then(() => {
    //     refreshCallback();
    //   })
    //   .catch(err => {
    //     console.error('Error deleting assignment:', err);
    //   });
    
    // For demo purposes, we'll just call the refresh callback
    refreshCallback();
    
    // Close the dialog
    setOpenDeleteDialog(false);
    setSelectedAssignment(null);
  };

  return {
    openDeleteDialog,
    setOpenDeleteDialog,
    selectedAssignment,
    handleOpenDeleteDialog,
    handleDeleteAssignment
  };
};

export default useAssignmentsDeleteDialog;
