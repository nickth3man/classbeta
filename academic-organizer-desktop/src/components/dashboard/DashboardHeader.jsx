import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button
} from '@mui/material';
import {
  Add as AddIcon
} from '@mui/icons-material';

/**
 * DashboardHeader component for displaying the dashboard header with action buttons
 */
const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Box>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/courses/new')}
          sx={{ mr: 1 }}
        >
          Add Course
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<AddIcon />}
          onClick={() => navigate('/assignments/new')}
        >
          Add Assignment
        </Button>
      </Box>
    </Box>
  );
};

export default DashboardHeader;
