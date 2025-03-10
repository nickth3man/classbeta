import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  FormHelperText,
  Box
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';

/**
 * Assignment form dialog component
 * @param {Object} props - Component props
 * @param {boolean} props.open - Whether the dialog is open
 * @param {Function} props.onClose - Function to call when dialog is closed
 * @param {Object} props.formData - Form data values
 * @param {Function} props.onChange - Function to call when form values change
 * @param {Function} props.onSave - Function to call when form is submitted
 * @param {Object} props.selectedAssignment - The assignment being edited (null if creating new)
 * @param {Array} props.courses - Available courses for assignment
 */
const AssignmentForm = ({
  open,
  onClose,
  formData,
  onChange,
  onSave,
  selectedAssignment,
  courses = []
}) => {
  const [errors, setErrors] = useState({});
  const isEditMode = !!selectedAssignment;
  
  // Reset errors when dialog opens/closes
  useEffect(() => {
    if (open) {
      setErrors({});
    }
  }, [open]);

  // Validate a single field
  const validateField = (name, value) => {
    switch (name) {
      case 'title':
        return value.trim() ? '' : 'Title is required';
      case 'due_date':
        if (!value) {
          return 'Due date is required';
        } else if (new Date(value) < new Date()) {
          return 'Due date cannot be in the past';
        }
        return '';
      default:
        return '';
    }
  };

  // Handle field change and validate
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    
    // Update error state
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
    
    // Call parent onChange
    onChange(e);
  };

  // Handle date change
  const handleDateChange = (date) => {
    const dateStr = date ? date.toISOString().split('T')[0] : '';
    
    // Create synthetic event for onChange handler
    const syntheticEvent = {
      target: {
        name: 'due_date',
        value: dateStr
      }
    };
    
    // Validate
    setErrors(prev => ({
      ...prev,
      due_date: validateField('due_date', dateStr)
    }));
    
    // Call parent onChange
    onChange(syntheticEvent);
  };

  // Validate all fields before submission
  const validateForm = () => {
    const newErrors = {
      title: validateField('title', formData.title),
      due_date: validateField('due_date', formData.due_date)
    };
    
    setErrors(newErrors);
    
    // Form is valid if all error messages are empty
    return Object.values(newErrors).every(error => !error);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      aria-labelledby="assignment-dialog-title"
    >
      <DialogTitle id="assignment-dialog-title">
        {isEditMode ? 'Edit Assignment' : 'Create New Assignment'}
      </DialogTitle>
      
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleFieldChange}
                error={!!errors.title}
                helperText={errors.title}
                required
                autoFocus
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleFieldChange}
                multiline
                rows={4}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Due Date"
                  value={formData.due_date ? new Date(formData.due_date) : null}
                  onChange={handleDateChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      required
                      error={!!errors.due_date}
                      helperText={errors.due_date}
                      margin="normal"
                    />
                  )}
                />
              </LocalizationProvider>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  labelId="status-label"
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleFieldChange}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {courses.length > 0 && (
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel id="course-label">Course</InputLabel>
                  <Select
                    labelId="course-label"
                    name="course_id"
                    value={formData.course_id}
                    label="Course"
                    onChange={handleFieldChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    {courses.map(course => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            {isEditMode ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AssignmentForm;
