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
  Assignment as AssignmentIcon,
  Add as AddIcon
} from '@mui/icons-material';

// Utils
import { formatDate, getDaysRemaining } from '../../utils/formatters';

/**
 * UpcomingAssignments component for displaying upcoming assignments on the dashboard
 * 
 * @param {Object} props
 * @param {Array} props.assignments - Array of assignment objects
 */
const UpcomingAssignments = ({ assignments }) => {
  const navigate = useNavigate();

  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" component="h2">
          Upcoming Assignments
        </Typography>
        <Button 
          size="small"
          onClick={() => navigate('/assignments')}
        >
          View All
        </Button>
      </Box>
      <Divider />
      {assignments.length > 0 ? (
        <List>
          {assignments.map((assignment) => (
            <ListItem 
              key={assignment.id}
              button
              onClick={() => navigate(`/assignments/${assignment.id}`)}
              sx={{ 
                borderLeft: 4, 
                borderColor: assignment.course_color || 'primary.main',
                mb: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                }
              }}
            >
              <ListItemIcon>
                <AssignmentIcon />
              </ListItemIcon>
              <ListItemText 
                primary={assignment.title}
                secondary={`${assignment.course_name} • Due: ${formatDate(assignment.due_date)}`}
              />
              <Typography 
                variant="body2" 
                color={
                  getDaysRemaining(assignment.due_date) === 'Overdue' 
                    ? 'error.main' 
                    : getDaysRemaining(assignment.due_date) === 'Due today' 
                      ? 'warning.main' 
                      : 'text.secondary'
                }
              >
                {getDaysRemaining(assignment.due_date)}
              </Typography>
            </ListItem>
          ))}
        </List>
      ) : (
        <Box py={4} textAlign="center">
          <Typography variant="body1" color="textSecondary">
            No upcoming assignments
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<AddIcon />}
            onClick={() => navigate('/assignments/new')}
            sx={{ mt: 2 }}
          >
            Add Assignment
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default UpcomingAssignments;
