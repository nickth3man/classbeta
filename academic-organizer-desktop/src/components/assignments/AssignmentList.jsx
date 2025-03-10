import React from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Chip,
  Box,
  Paper,
  Tooltip,
  Divider
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable assignment item component
const SortableAssignmentItem = ({ assignment, onEdit, onDelete, showCourse }) => {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition 
  } = useSortable({ id: assignment.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
  };

  // Status color mapping
  const statusColors = {
    'Completed': 'success',
    'In Progress': 'warning',
    'Pending': 'info',
    'Late': 'error'
  };

  return (
    <ListItem 
      ref={setNodeRef} 
      sx={style} 
      {...attributes} 
      {...listeners}
      divider
    >
      <ListItemText
        primary={
          <Typography variant="subtitle1" component="div">
            {assignment.title}
            <Chip 
              label={assignment.status} 
              size="small" 
              color={statusColors[assignment.status] || 'default'} 
              sx={{ ml: 1 }}
            />
          </Typography>
        }
        secondary={
          <Box>
            <Typography variant="body2" color="text.secondary">
              Due: {format(new Date(assignment.due_date), 'MMM d, yyyy')}
            </Typography>
            {showCourse && assignment.course && (
              <Typography variant="body2" color="text.secondary">
                Course: {assignment.course.name || 'N/A'}
              </Typography>
            )}
          </Box>
        }
      />
      <ListItemSecondaryAction>
        <Tooltip title="Edit">
          <IconButton edge="end" aria-label="edit" onClick={() => onEdit(assignment)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton edge="end" aria-label="delete" onClick={() => onDelete(assignment)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

SortableAssignmentItem.propTypes = {
  assignment: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  showCourse: PropTypes.bool
};

/**
 * Assignment list component with drag-and-drop functionality
 */
const AssignmentList = ({ 
  assignments, 
  onEdit, 
  onDelete, 
  showCourse = false,
  onDragEnd
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // If no assignments, show empty state
  if (!assignments || assignments.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="subtitle1" color="text.secondary">
          No assignments found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Create a new assignment to get started
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper>
      <Box p={1}>
        <Typography variant="h6" gutterBottom>
          Assignments
        </Typography>
        <Divider />
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={onDragEnd}
        >
          <SortableContext 
            items={assignments.map(a => a.id)} 
            strategy={verticalListSortingStrategy}
          >
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {assignments.map((assignment) => (
                <SortableAssignmentItem
                  key={assignment.id}
                  assignment={assignment}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  showCourse={showCourse}
                />
              ))}
            </List>
          </SortableContext>
        </DndContext>
      </Box>
    </Paper>
  );
};

AssignmentList.propTypes = {
  assignments: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  showCourse: PropTypes.bool,
  onDragEnd: PropTypes.func
};

export default AssignmentList;
