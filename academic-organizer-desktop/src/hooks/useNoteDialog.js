import { useState } from 'react';
import { getDb } from '../database/db';

/**
 * Custom hook to manage note dialog state and operations
 * @param {string} courseId - The ID of the course
 * @param {Function} refreshData - Function to refresh course data
 * @returns {Object} Note dialog state and handlers
 */
export const useNoteDialog = (courseId, refreshData) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  // Handle form input changes
  const handleInputChange = (newData) => {
    setFormData(newData);
  };

  // Open dialog for adding
  const handleAddNote = () => {
    setSelectedNote(null);
    setFormData({
      title: '',
      content: '',
    });
    setOpenDialog(true);
  };

  // Open dialog for editing
  const handleEditNote = (note) => {
    setSelectedNote(note);
    setFormData({
      title: note.title,
      content: note.content || '',
    });
    setOpenDialog(true);
  };

  // Save note
  const handleSaveNote = () => {
    try {
      const db = getDb();
      
      // Prepare data
      const { title, content } = formData;
      
      if (selectedNote) {
        // Update existing note
        db.prepare(`
          UPDATE notes 
          SET title = ?, content = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `).run(title, content, selectedNote.id);
      } else {
        // Add new note
        db.prepare(`
          INSERT INTO notes (course_id, title, content)
          VALUES (?, ?, ?)
        `).run(courseId, title, content);
      }
      
      // Reset form and close dialog
      setFormData({
        title: '',
        content: '',
      });
      setSelectedNote(null);
      setOpenDialog(false);
      
      // Refresh data
      refreshData();
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  return {
    openDialog,
    formData,
    isEditing: !!selectedNote,
    handleInputChange,
    handleAddNote,
    handleEditNote,
    handleSaveNote,
    closeDialog: () => setOpenDialog(false)
  };
};

export default useNoteDialog;
