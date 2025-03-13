import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  TextField, 
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Grid,
  Typography,
  Box
} from '@mui/material';
import useCoursesList from '../../hooks/useCoursesList';

/**
 * Dialog for creating and editing assignment templates
 */
const AssignmentTemplateDialog = ({ open, template, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [defaultTitle, setDefaultTitle] = useState('');
  const [defaultDescription, setDefaultDescription] = useState('');
  const [errors, setErrors] = useState({});
  
  // Get courses for dropdown
  const { courses, loading: coursesLoading } = useCoursesList();
  
  // Reset form when template changes or dialog opens
  useEffect(() => {
    if (open) {
      if (template) {
        // Edit mode - populate with template data
        setName(template.name || '');
        setDescription(template.description || '');
        setCourseId(template.defaults.course_id || '');
        setDefaultTitle(template.defaults.title || '');
        setDefaultDescription(template.defaults.description || '');
      } else {
        // Create mode - reset form
        setName('');
        setDescription('');
        setCourseId('');
        setDefaultTitle('');
        setDefaultDescription('');
      }
      setErrors({});
    }
  }, [open, template]);
  
  // Validate the form
  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Template name is required';
    }
    
    if (!defaultTitle.trim()) {
      newErrors.defaultTitle = 'Default title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle save button click
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }
    
    // Find the course name if a course ID is selected
    const selectedCourse = courses.find(course => course.id === courseId);
    
    const templateData = {
      name,
      description,
      defaults: {
        title: defaultTitle,
        description: defaultDescription,
        course_id: courseId || null,
        course_name: selectedCourse?.name || null
      }
    };
    
    if (template?.id) {
      templateData.id = template.id;
    }
    
    onSave(templateData);
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
        <Grid container spacing={3} sx={{ mt: 0 }}>
          {/* Template Information */}
          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Template Information
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Template Name"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              error={!!errors.name}
              helperText={errors.name}
              margin="normal"
              autoFocus
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="course-select-label">Default Course</InputLabel>
              <Select
                labelId="course-select-label"
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                label="Default Course"
                disabled={coursesLoading}
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
              <FormHelperText>
                Optionally assign a default course for this template
              </FormHelperText>
            </FormControl>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Template Description"
              fullWidth
              multiline
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              placeholder="Describe when to use this template"
            />
          </Grid>
          
          {/* Default Assignment Values */}
          <Grid item xs={12}>
            <Box sx={{ my: 1 }}>
              <Divider />
            </Box>
            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Default Assignment Values
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Default Assignment Title"
              fullWidth
              value={defaultTitle}
              onChange={(e) => setDefaultTitle(e.target.value)}
              required
              error={!!errors.defaultTitle}
              helperText={errors.defaultTitle}
              margin="normal"
              placeholder="e.g., 'Weekly Lab Report'"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Default Assignment Description"
              fullWidth
              multiline
              rows={4}
              value={defaultDescription}
              onChange={(e) => setDefaultDescription(e.target.value)}
              margin="normal"
              placeholder="Default instructions or requirements for this type of assignment"
            />
          </Grid>
        </Grid>
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
        >
          Save Template
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// Add missing Divider component
const Divider = () => (
  <Box
    sx={{
      height: '1px',
      width: '100%',
      backgroundColor: 'divider',
    }}
  />
);

export default AssignmentTemplateDialog;
