import { useState } from 'react';
import { getDb } from '../database/db';

/**
 * Custom hook to manage course dialog state and operations
 * @param {Function} refreshCourses - Function to refresh courses list after changes
 * @returns {Object} Dialog state and handlers
 */
export const useCourseDialog = (refreshCourses) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  // Form state with default values
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    instructor: '',
    startDate: '',
    endDate: '',
    description: '',
    color: '#2563EB',
  });

  // Reset form to default values
  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      instructor: '',
      startDate: '',
      endDate: '',
      description: '',
      color: '#2563EB',
    });
    setSelectedCourse(null);
  };

  // Open dialog for adding a new course
  const handleAddCourse = () => {
    resetForm();
    setOpenDialog(true);
  };

  // Open dialog for editing an existing course
  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setFormData({
      name: course.name,
      code: course.code || '',
      instructor: course.instructor || '',
      startDate: course.start_date || '',
      endDate: course.end_date || '',
      description: course.description || '',
      color: course.color || '#2563EB',
    });
    setOpenDialog(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Save course (add or update)
  const handleSaveCourse = () => {
    try {
      const db = getDb();
      
      // Prepare data
      const { name, code, instructor, startDate, endDate, description, color } = formData;
      
      if (selectedCourse) {
        // Update existing course
        db.prepare(`
          UPDATE courses 
          SET name = ?, code = ?, instructor = ?, start_date = ?, end_date = ?, description = ?, color = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(name, code, instructor, startDate, endDate, description, color, selectedCourse.id);
      } else {
        // Add new course
        db.prepare(`
          INSERT INTO courses (name, code, instructor, start_date, end_date, description, color)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(name, code, instructor, startDate, endDate, description, color);
      }
      
      // Reset form and close dialog
      resetForm();
      setOpenDialog(false);
      
      // Refresh courses
      refreshCourses();
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  return {
    openDialog,
    setOpenDialog,
    selectedCourse,
    formData,
    handleInputChange,
    handleAddCourse,
    handleEditCourse,
    handleSaveCourse
  };
};

export default useCourseDialog;
