import React from 'react';
import { Box, Typography, Paper, Grid, Divider } from '@mui/material';

/**
 * CourseInfo component displays detailed information about a course
 */
function CourseInfo({ course, assignments, files, notes, formatDate }) {
  return (
    <Paper sx={{ mb: 3, p: 3, borderTop: 4, borderColor: course.color || 'primary.main' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {course.code && (
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">Course Code</Typography>
              <Typography variant="body1">{course.code}</Typography>
            </Box>
          )}
          
          {course.instructor && (
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">Instructor</Typography>
              <Typography variant="body1">{course.instructor}</Typography>
            </Box>
          )}
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary">Date Range</Typography>
            <Typography variant="body1">
              {formatDate(course.start_date)} - {formatDate(course.end_date)}
            </Typography>
          </Box>
          
          <Box display="flex" gap={2}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Assignments</Typography>
              <Typography variant="body1">{assignments.length}</Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Files</Typography>
              <Typography variant="body1">{files.length}</Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">Notes</Typography>
              <Typography variant="body1">{notes.length}</Typography>
            </Box>
          </Box>
        </Grid>
        
        {course.description && (
          <Grid item xs={12}>
            <Divider sx={{ my: 1 }} />
            <Typography variant="subtitle2" color="text.secondary">Description</Typography>
            <Typography variant="body1">{course.description}</Typography>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
}

export default CourseInfo;