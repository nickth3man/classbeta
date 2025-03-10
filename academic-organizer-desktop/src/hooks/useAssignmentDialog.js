import { useState } from 'react';

/**
 * Custom hook to manage assignment dialog state and operations
 * @returns {Object} Assignment dialog state and handlers
 */
export const useAssignmentDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Handle dialog open
  const handleOpen = (assignment = null) => {
    setSelectedAssignment(assignment);
    setOpen(true);
  };

  // Handle dialog close
  const handleClose = () => {
    setOpen(false);
    setTimeout(() => setSelectedAssignment(null), 300); // Clear selection after animation
  };

  return {
    dialogOpen: open,
    currentAssignment: selectedAssignment,
    openAssignmentDialog: handleOpen,
    closeAssignmentDialog: handleClose
  };
};

export default useAssignmentDialog;
