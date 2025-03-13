import React from 'react';
import { Box, Typography, Card, CardContent, IconButton, Tooltip, CircularProgress } from '@mui/material';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { format } from 'date-fns';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable assignment item component
const SortableAssignmentItem = ({ assignment, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: assignment.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative',
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        border: isDragging ? '2px dashed #2196f3' : '1px solid #e0e0e0',
        boxShadow: isDragging ? '0 8px 16px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)',
      }}
      onClick={() => onClick(assignment)}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', padding: '12px !important' }}>
        <IconButton 
          size="small" 
          {...attributes} 
          {...listeners} 
          sx={{ cursor: 'grab', mr: 1 }}
          onClick={(e) => e.stopPropagation()}
        >
          <DragIndicatorIcon />
        </IconButton>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" component="div" sx={{ fontWeight: 'medium' }}>
            {assignment.title}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
            {assignment.course_name && (
              <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                {assignment.course_name}
              </Typography>
            )}
            
            {assignment.due_date && (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                <EventIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(assignment.due_date), 'MMM d, yyyy')}
                </Typography>
              </Box>
            )}
            
            {assignment.due_date && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {format(new Date(assignment.due_date), 'h:mm a')}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            width: 32, 
            height: 32, 
            borderRadius: '50%', 
            bgcolor: 'primary.main',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          {assignment.priority}
        </Box>
      </CardContent>
    </Card>
  );
};

// Main assignment list component with drag-and-drop functionality
const AssignmentList = ({ 
  assignments,
  loading,
  error,
  onAssignmentClick,
  onPriorityChange,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generate assignment IDs for SortableContext
  const assignmentIds = assignments.map(assignment => assignment.id);

  const handleDragEnd = (event) => {
    if (onPriorityChange) {
      onPriorityChange(event);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (assignments.length === 0) {
    return (
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          No assignments found. Create a new assignment to get started.
        </Typography>
      </Box>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={assignmentIds}
        strategy={verticalListSortingStrategy}
      >
        <Box sx={{ p: 2 }}>
          {assignments.map((assignment) => (
            <SortableAssignmentItem
              key={assignment.id}
              assignment={assignment}
              onClick={onAssignmentClick}
            />
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
};

export default AssignmentList;
