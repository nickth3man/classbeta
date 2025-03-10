import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  IconButton 
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Event as EventIcon 
} from '@mui/icons-material';

/**
 * NoteList component displays a list of notes for a course
 */
function NoteList({ 
  notes, 
  onAddClick, 
  onEditClick, 
  onDeleteClick, 
  formatDate 
}) {
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Notes</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={onAddClick}
        >
          Add Note
        </Button>
      </Box>

      {notes.length > 0 ? (
        <Grid container spacing={3}>
          {notes.map((note) => (
            <Grid item xs={12} md={6} key={note.id}>
              <Card>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" component="h3" gutterBottom>
                      {note.title}
                    </Typography>
                    <Box>
                      <IconButton 
                        size="small" 
                        onClick={() => onEditClick(note)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => onDeleteClick(note.id)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Box display="flex" alignItems="center" mb={2}>
                    <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      Created: {formatDate(note.created_at)}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2">
                    {note.content.length > 150
                      ? `${note.content.substring(0, 150)}...`
                      : note.content}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box textAlign="center" py={4}>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            No notes yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click "Add Note" to create your first note
          </Typography>
        </Box>
      )}
    </>
  );
}

export default NoteList;