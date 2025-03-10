import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  TextField,
  Box
} from '@mui/material';

/**
 * NoteDialog component for adding or editing notes
 */
function NoteDialog({ 
  open, 
  onClose, 
  onSave, 
  formData, 
  onChange, 
  isEditing 
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Note' : 'Add Note'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Note Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
          
          <TextField
            margin="normal"
            fullWidth
            id="content"
            label="Content"
            name="content"
            multiline
            rows={10}
            value={formData.content}
            onChange={handleInputChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={onSave}
          variant="contained"
          disabled={!formData.title}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NoteDialog;