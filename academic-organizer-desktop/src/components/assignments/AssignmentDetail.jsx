import React from 'react';
import { Box, Card, CardContent, Typography, Chip, Divider } from '@mui/material';
import { format } from 'date-fns';

/**
 * Assignment detail component
 * Displays detailed information about a selected assignment
 * @param {Object} props - Component props
 * @param {Object} props.assignment - The assignment to display
 */
const AssignmentDetail = ({ assignment }) => {
  if (!assignment) {
    return (
      <Card variant="outlined" sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CardContent>
          <Typography variant="body1" color="text.secondary" align="center">
            Select an assignment to view details
          </Typography>
        </CardContent>
      </Card>
    );
  }

  // Format due date for display
  const formattedDate = assignment.due_date ? 
    format(new Date(assignment.due_date), 'MMMM d, yyyy') : 
    'No due date';
  
  // Determine status color
  const statusColor = assignment.status === 'Completed' ? 'success' : 'warning';

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          {assignment.title}
        </Typography>
        
        <Chip 
          label={assignment.status} 
          color={statusColor} 
          size="small" 
          sx={{ mb: 2 }} 
        />
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Due: {formattedDate}
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="subtitle1" gutterBottom>
          Description
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
          {assignment.description || 'No description provided'}
        </Typography>
        
        {assignment.course && (
          <Box mt={2}>
            <Typography variant="subtitle2" color="text.secondary">
              Course: {assignment.course}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default AssignmentDetail;
