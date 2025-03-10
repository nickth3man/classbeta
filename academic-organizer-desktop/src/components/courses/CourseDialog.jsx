import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

// Color options for courses
const colorOptions = [
  { name: 'Blue', value: '#2563EB' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F59E0B' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Teal', value: '#14B8A6' },
];

/**
 * CourseDialog component for adding or editing courses
 * 
 * @param {Object} props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to handle dialog close
 * @param {Object} props.formData - Form data state
 * @param {Function} props.onChange - Function to handle input changes
 * @param {Function} props.onSave - Function to handle save action
 * @param {Object} props.selectedCourse - Selected course for editing (null for new course)
 */
const CourseDialog = ({ open, onClose, formData, onChange, onSave, selectedCourse }) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {selectedCourse ? 'Edit Course' : 'Add New Course'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Course Name"
            name="name"
            value={formData.name}
            onChange={onChange}
          />
          
          <TextField
            margin="normal"
            fullWidth
            label="Course Code"
            name="code"
            value={formData.code}
            onChange={onChange}
          />
          
          <TextField
            margin="normal"
            fullWidth
            label="Instructor"
            name="instructor"
            value={formData.instructor}
            onChange={onChange}
          />
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={onChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="color-label">Color</InputLabel>
            <Select
              labelId="color-label"
              name="color"
              value={formData.color}
              label="Color"
              onChange={onChange}
            >
              {colorOptions.map((color) => (
                <MenuItem key={color.value} value={color.value}>
                  <Box display="flex" alignItems="center">
                    <Box 
                      width={20} 
                      height={20} 
                      borderRadius="50%" 
                      bgcolor={color.value} 
                      mr={1} 
                    />
                    {color.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="normal"
            fullWidth
            label="Description"
            name="description"
            multiline
            rows={4}
            value={formData.description}
            onChange={onChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={onSave}
          variant="contained"
          disabled={!formData.name}
        >
          {selectedCourse ? 'Update' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CourseDialog;
