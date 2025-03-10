import { useState } from 'react';
import { getDb } from '../database/db';

/**
 * Custom hook to manage course deletion dialog state and operations
 * @param {Function} refreshCourses - Function to refresh courses list after deletion
 * @returns {Object} Dialog state and handlers
 */
export const useCoursesDeleteDialog = (refreshCourses) => {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // Open delete confirmation dialog
  const handleOpenDeleteDialog = (course) => {
    setSelectedCourse(course);
    setOpenDeleteDialog(true);
  };

  // Handle course deletion
  const handleDeleteCourse = () => {
    try {
      if (!selectedCourse) return;
      
      const db = getDb();
      db.prepare('DELETE FROM courses WHERE id = ?').run(selectedCourse.id);
      
      setSelectedCourse(null);
      setOpenDeleteDialog(false);
      
      // Refresh courses
      refreshCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return {
    openDeleteDialog,
    setOpenDeleteDialog,
    selectedCourse,
    handleOpenDeleteDialog,
    handleDeleteCourse
  };
};

export default useCoursesDeleteDialog;
