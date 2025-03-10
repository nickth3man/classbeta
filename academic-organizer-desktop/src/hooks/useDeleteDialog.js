import { useState } from 'react';
import { getDb } from '../database/db';

/**
 * Custom hook to manage delete confirmation dialog
 * @param {Function} refreshData - Function to refresh course data
 * @returns {Object} Delete dialog state and handlers
 */
export const useDeleteDialog = (refreshData) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteType, setDeleteType] = useState('');
  const [deleteItemId, setDeleteItemId] = useState(null);

  // Open delete dialog
  const handleOpenDeleteDialog = (type, itemId) => {
    setDeleteType(type);
    setDeleteItemId(itemId);
    setOpenDialog(true);
  };

  // Handle delete item
  const handleDeleteItem = () => {
    try {
      const db = getDb();
      
      if (deleteType === 'assignment') {
        db.prepare('DELETE FROM assignments WHERE id = ?').run(deleteItemId);
      } else if (deleteType === 'file') {
        db.prepare('DELETE FROM files WHERE id = ?').run(deleteItemId);
      } else if (deleteType === 'note') {
        db.prepare('DELETE FROM notes WHERE id = ?').run(deleteItemId);
      }
      
      setOpenDialog(false);
      
      // Refresh data
      refreshData();
    } catch (error) {
      console.error(`Error deleting ${deleteType}:`, error);
    }
  };

  return {
    openDialog,
    deleteType,
    handleOpenDeleteDialog,
    handleDeleteItem,
    closeDialog: () => setOpenDialog(false)
  };
};

export default useDeleteDialog;
