import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

/**
 * Dialog component for confirming assignment deletion
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when dialog is closed
 * @param {Function} props.onDelete - Function to call when delete is confirmed
 * @param {Object} props.assignment - The assignment to delete
 */
const DeleteAssignmentDialog = ({ open, onClose, onDelete, assignment }) => {
  // Don't render if no assignment is selected
  if (!assignment) return null;

  const handleDelete = () => {
    onDelete(assignment);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-assignment-dialog-title"
      aria-describedby="delete-assignment-dialog-description"
    >
      <DialogTitle id="delete-assignment-dialog-title">
        Delete Assignment
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-assignment-dialog-description">
          Are you sure you want to delete "{assignment.title}"? This action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAssignmentDialog;
