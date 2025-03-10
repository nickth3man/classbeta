import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Box,
  FormHelperText
} from '@mui/material';

/**
 * Dialog for creating and editing assignment templates
 */
const AssignmentTemplateDialog = ({
  open,
  onClose,
  onSave,
  template = null,
  courses = []
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    defaults: {
      title: '',
      description: '',
      status: 'Pending',
      course_id: '',
      priority: 0
    }
  });
  
  const [errors, setErrors] = useState({});

  // Initialize form with template data if editing
  useEffect(() => {
    if (template) {
      setFormData({
        ...template
      });
    } else {
      // Reset form for new template
      setFormData({
        name: '',
        description: '',
        defaults: {
          title: '',
          description: '',
          status: 'Pending',
          course_id: '',
          priority: 0
        }
      });
    }
    setErrors({});
  }, [template, open]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested properties (defaults.title, defaults.description, etc.)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      // Handle top-level properties
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form before submission
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }
    
    if (!formData.defaults.title.trim()) {
      newErrors['defaults.title'] = 'Default title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        {template ? 'Edit Assignment Template' : 'Create Assignment Template'}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            {/* Template Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Template Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="Template Name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors.name}
                helperText={errors.name}
                placeholder="e.g., Weekly Lab Report, Essay Assignment"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="description"
                label="Template Description"
                value={formData.description}
                onChange={handleInputChange}
                fullWidth
                placeholder="Optional description of when to use this template"
              />
            </Grid>
            
            {/* Default Assignment Values */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Default Assignment Values
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                These values will be pre-filled when creating a new assignment from this template.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="defaults.title"
                label="Default Title"
                value={formData.defaults.title}
                onChange={handleInputChange}
                fullWidth
                required
                error={!!errors['defaults.title']}
                helperText={errors['defaults.title']}
                placeholder="e.g., {Course} Lab Report"
              />
              <FormHelperText>
                You can use {'{Course}'} as a placeholder for the course name
              </FormHelperText>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="course-select-label">Default Course</InputLabel>
                <Select
                  labelId="course-select-label"
                  name="defaults.course_id"
                  value={formData.defaults.course_id}
                  onChange={handleInputChange}
                  label="Default Course"
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="defaults.description"
                label="Default Description"
                value={formData.defaults.description}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
                placeholder="Default assignment description"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel id="status-select-label">Default Status</InputLabel>
                <Select
                  labelId="status-select-label"
                  name="defaults.status"
                  value={formData.defaults.status}
                  onChange={handleInputChange}
                  label="Default Status"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="defaults.priority"
                label="Default Priority"
                type="number"
                value={formData.defaults.priority}
                onChange={handleInputChange}
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
        >
          Save Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AssignmentTemplateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  template: PropTypes.object,
  courses: PropTypes.array
};

export default AssignmentTemplateDialog;
