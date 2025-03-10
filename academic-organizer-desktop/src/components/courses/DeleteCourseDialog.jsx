import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography
} from '@mui/material';

/**
 * DeleteCourseDialog component for confirming course deletion
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to handle dialog close
 * @param {Function} props.onDelete - Function to handle delete action
 * @param {Object} props.course - Course to be deleted
 */
const DeleteCourseDialog = ({ open, onClose, onDelete, course }) => {
  if (!course) return null;
  
  return (
    <Dialog
      open={open}
      onClose={onClose}
    >
      <DialogTitle>Delete Course</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete "{course.name}"? This action cannot be undone.
        </Typography>
        <Typography variant="body2" color="error" sx={{ mt: 2 }}>
          All assignments and files associated with this course will also be deleted.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onDelete} color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCourseDialog;
