import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  Chip, 
  IconButton 
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  CalendarToday as CalendarTodayIcon 
} from '@mui/icons-material';

/**
 * AssignmentList component displays a list of assignments for a course
 */
function AssignmentList({ 
  assignments, 
  onAddClick, 
  onEditClick, 
  onDeleteClick, 
  formatDate,
  getStatusColor,
  getPriorityColor 
}) {
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Assignments</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={onAddClick}
        >
          Add Assignment
        </Button>
      </Box>

      {assignments.length > 0 ? (
        <Grid container spacing={3}>
          {assignments.map((assignment) => (
            <Grid item xs={12} md={6} key={assignment.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" component="h3" gutterBottom>
                      {assignment.title}
                    </Typography>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => onEditClick(assignment)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => onDeleteClick(assignment.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Box display="flex" gap={1} mb={2}>
                    <Chip 
                      label={assignment.status.replace('_', ' ')} 
                      size="small" 
                      color={getStatusColor(assignment.status)}
                    />
                    <Chip 
                      label={`${assignment.priority} priority`} 
                      size="small" 
                      color={getPriorityColor(assignment.priority)}
                    />
                  </Box>
                  
                  {assignment.due_date && (
                    <Box display="flex" alignItems="center" mb={2}>
                      <CalendarTodayIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">
                        Due: {formatDate(assignment.due_date)}
                      </Typography>
                    </Box>
                  )}
                  
                  {assignment.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {assignment.description.length > 100
                        ? `${assignment.description.substring(0, 100)}...`
                        : assignment.description}
                    </Typography>
                  )}
                  
                  <Box>
                    <Typography variant="body2" gutterBottom>
                      Completion: {assignment.completion_percentage}%
                    </Typography>
                    <Box 
                      sx={{ 
                        width: '100%', 
                        height: 8, 
                        bgcolor: 'grey.200', 
                        borderRadius: 1,
                        overflow: 'hidden'
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: `${assignment.completion_percentage}%`, 
                          height: '100%', 
                          bgcolor: 'primary.main' 
                        }}
                      />
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No assignments yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click "Add Assignment" to create your first assignment
          </Typography>
        </Box>
      )}
    </>
  );
}

export default AssignmentList;