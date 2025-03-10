import React from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { ArrowBack as ArrowBackIcon, Edit as EditIcon } from '@mui/icons-material';

/**
 * CourseHeader component displays the course title and navigation controls
 */
function CourseHeader({ course, onBackClick, onEditClick }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Box display="flex" alignItems="center">
        <IconButton onClick={onBackClick} sx={{ mr: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" component="h1">
          {course.name}
        </Typography>
      </Box>
      <Button 
        variant="outlined" 
        startIcon={<EditIcon />}
        onClick={onEditClick}
      >
        Edit Course
      </Button>
    </Box>
  );
}

export default CourseHeader;