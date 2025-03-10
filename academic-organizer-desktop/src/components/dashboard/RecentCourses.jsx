import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  Book as CourseIcon,
  Add as AddIcon
} from '@mui/icons-material';

/**
 * RecentCourses component for displaying recent courses on the dashboard
 * 
 * @param {Object} props
 * @param {Array} props.courses - Array of course objects
 */
const RecentCourses = ({ courses }) => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h2">
          Your Courses
        </Typography>
        <Button 
          size="small"
          onClick={() => navigate('/courses')}
        >
          View All
        </Button>
      </Box>
      <Divider />
      {courses.length > 0 ? (
        <List>
          {courses.map((course) => (
            <ListItem 
              key={course.id}
              button
              onClick={() => navigate(`/courses/${course.id}`)}
              sx={{ 
                borderLeft: 4, 
                borderColor: course.color || 'primary.main',
                mb: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <ListItemIcon>
                <CourseIcon />
              </ListItemIcon>
              <ListItemText 
                primary={course.name}
                secondary={course.code || 'No course code'}
              />
            </ListItem>
          ))}
        </List>
      ) : (
        <Box py={4} textAlign="center">
          <Typography variant="body1" color="textSecondary">
            No courses added yet
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/courses/new')}
            sx={{ mt: 2 }}
          >
            Add Course
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default RecentCourses;
