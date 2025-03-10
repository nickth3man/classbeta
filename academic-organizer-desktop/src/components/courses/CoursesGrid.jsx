import React from 'react';
import { Grid, Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

// Components
import CourseCard from './CourseCard';

/**
 * CoursesGrid component to display a grid of course cards
 * 
 * @param {Object} props
 * @param {Array} props.courses - Array of course objects to display
 * @param {Function} props.onEdit - Function to handle edit action
 * @param {Function} props.onDelete - Function to handle delete action
 * @param {string} props.searchQuery - Current search query (for empty state message)
 * @param {Function} props.onAddCourse - Function to handle add course action
 */
const CoursesGrid = ({ courses, onEdit, onDelete, searchQuery, onAddCourse }) => {
  if (courses.length === 0) {
    return (
      <Box 
        display="flex" 
        flexDirection="column" 
        alignItems="center" 
        justifyContent="center" 
        py={8}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No courses found
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          {searchQuery ? 'Try a different search term' : 'Add your first course to get started'}
        </Typography>
        {!searchQuery && (
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={onAddCourse}
            sx={{ mt: 2 }}
          >
            Add Course
          </Button>
        )}
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course.id}>
          <CourseCard 
            course={course} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default CoursesGrid;
