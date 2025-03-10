import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  IconButton
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

// Utils
import { formatDate } from '../../utils/formatters';

/**
 * CourseCard component displays a single course in a card format
 * 
 * @param {Object} props
 * @param {Object} props.course - Course data object
 * @param {Function} props.onEdit - Function to handle edit action
 * @param {Function} props.onDelete - Function to handle delete action
 */
const CourseCard = ({ course, onEdit, onDelete }) => {
  const navigate = useNavigate();

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderTop: 4,
        borderColor: course.color || 'primary.main',
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="h2" gutterBottom>
            {course.name}
          </Typography>
          <Box>
            <IconButton 
              size="small" 
              onClick={() => onEdit(course)}
              sx={{ mr: 1 }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={() => onDelete(course)}
              color="error"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        {course.code && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Code: {course.code}
          </Typography>
        )}
        
        {course.instructor && (
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Instructor: {course.instructor}
          </Typography>
        )}
        
        <Box display="flex" gap={2} mt={1}>
          {course.start_date && (
            <Typography variant="body2" color="text.secondary">
              Start: {formatDate(course.start_date)}
            </Typography>
          )}
          
          {course.end_date && (
            <Typography variant="body2" color="text.secondary">
              End: {formatDate(course.end_date)}
            </Typography>
          )}
        </Box>
        
        {course.description && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            {course.description.length > 100
              ? `${course.description.substring(0, 100)}...`
              : course.description}
          </Typography>
        )}
        
        <Box display="flex" alignItems="center" mt={2}>
          <AssignmentIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary">
            {course.assignmentCount} {course.assignmentCount === 1 ? 'Assignment' : 'Assignments'}
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button 
          size="small" 
          onClick={() => navigate(`/courses/${course.id}`)}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default CourseCard;
