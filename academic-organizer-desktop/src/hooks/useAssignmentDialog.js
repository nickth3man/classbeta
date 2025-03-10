import { useState, useEffect } from 'react';

/**
 * Custom hook to manage assignment dialog state and operations
 * @param {Function} refreshCallback - Function to call after successful save
 * @returns {Object} Assignment dialog state and handlers
 */
export const useAssignmentDialog = (refreshCallback) => {
  const [open, setOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    status: 'Pending',
    course_id: ''
  });

  // Initialize form data when selected assignment changes
  useEffect(() => {
    if (selectedAssignment) {
      setFormData({
        title: selectedAssignment.title || '',
        description: selectedAssignment.description || '',
        due_date: selectedAssignment.due_date || '',
        status: selectedAssignment.status || 'Pending',
        course_id: selectedAssignment.course_id || ''
      });
    } else {
      // Reset form when creating a new assignment
      setFormData({
        title: '',
        description: '',
        due_date: '',
        status: 'Pending',
        course_id: ''
      });
    }
  }, [selectedAssignment]);

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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSaveAssignment = (validatedData) => {
    // Determine if this is a create or update operation
    const isEdit = !!selectedAssignment;
    
    if (isEdit) {
      // Update existing assignment
      console.log('Updating assignment:', { id: selectedAssignment.id, ...validatedData });
      // In a real app, this would call the database
      // db.updateAssignment(selectedAssignment.id, validatedData)
      //   .then(() => {
      //     refreshCallback();
      //     handleClose();
      //   })
      //   .catch(err => console.error('Error updating assignment:', err));
    } else {
      // Create new assignment
      console.log('Creating new assignment:', validatedData);
      // In a real app, this would call the database
      // db.createAssignment(validatedData)
      //   .then(() => {
      //     refreshCallback();
      //     handleClose();
      //   })
      //   .catch(err => console.error('Error creating assignment:', err));
    }
    
    // For demo purposes, we'll just call the refresh callback
    if (refreshCallback) refreshCallback();
    handleClose();
  };

  return {
    dialogOpen: open,
    currentAssignment: selectedAssignment,
    formData,
    openAssignmentDialog: handleOpen,
    closeAssignmentDialog: handleClose,
    handleInputChange,
    handleSaveAssignment
  };
};

export default useAssignmentDialog;
