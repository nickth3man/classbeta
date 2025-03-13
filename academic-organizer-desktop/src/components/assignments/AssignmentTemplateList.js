import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Paper, 
  Divider, 
  Button, 
  Tooltip,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AssignmentIcon from '@mui/icons-material/Assignment';
import useAssignmentTemplates from '../../hooks/useAssignmentTemplates';
import AssignmentTemplateDialog from './AssignmentTemplateDialog';
import { useDeleteDialog } from '../../hooks';

/**
 * Component to display and manage assignment templates
 */
const AssignmentTemplateList = ({ onCreateAssignment }) => {
  const { 
    templates, 
    loading, 
    error, 
    saveTemplate, 
    deleteTemplate,
    createFromTemplate
  } = useAssignmentTemplates();
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Delete dialog functionality
  const { 
    showDeleteDialog, 
    confirmDelete, 
    handleDelete, 
    handleDeleteCancel 
  } = useDeleteDialog({
    onConfirmDelete: async (templateId) => {
      const success = await deleteTemplate(templateId);
      return success;
    },
    entityName: 'template'
  });

  // Open create dialog
  const handleCreateNew = () => {
    setSelectedTemplate(null);
    setDialogOpen(true);
  };

  // Open edit dialog
  const handleEdit = (template) => {
    setSelectedTemplate(template);
    setDialogOpen(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTemplate(null);
  };

  // Handle dialog save
  const handleSave = async (templateData) => {
    await saveTemplate({
      ...templateData,
      id: selectedTemplate ? selectedTemplate.id : null
    });
    setDialogOpen(false);
  };

  // Handle creating an assignment from a template
  const handleUseTemplate = async (template) => {
    // Get current date for default due date (1 week from now)
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    // Default overrides - dates would typically be set by the user
    const overrides = {
      due_date: nextWeek.toISOString().split('T')[0],
    };

    // Create the assignment
    const newAssignment = await createFromTemplate(template.id, overrides);
    
    // Notify parent for further actions (like selecting the new assignment)
    if (newAssignment && onCreateAssignment) {
      onCreateAssignment(newAssignment);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ mt: 2, mb: 4 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          Assignment Templates
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          color="primary"
          onClick={handleCreateNew}
        >
          New Template
        </Button>
      </Box>
      
      <Divider />
      
      {error && (
        <Box sx={{ p: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      
      {templates.length === 0 ? (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <AssignmentIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No assignment templates yet. Create a template to save time on recurring assignments.
          </Typography>
        </Box>
      ) : (
        <List sx={{ width: '100%' }}>
          {templates.map((template) => (
            <React.Fragment key={template.id}>
              <ListItem
                secondaryAction={
                  <Box>
                    <Tooltip title="Use template">
                      <IconButton edge="end" onClick={() => handleUseTemplate(template)}>
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit template">
                      <IconButton edge="end" onClick={() => handleEdit(template)}>
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete template">
                      <IconButton edge="end" onClick={() => showDeleteDialog(template.id, template.name)}>
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemText
                  primary={template.name}
                  secondary={
                    <Box>
                      <Typography variant="body2" component="span" color="text.secondary">
                        {template.description || 'No description'}
                      </Typography>
                      <Box mt={1}>
                        <Typography variant="caption" component="div" color="text.secondary">
                          Default Course: {template.defaults.course_id ? template.defaults.course_name : 'None'}
                        </Typography>
                        {template.defaults.description && (
                          <Typography variant="caption" component="div" color="text.secondary">
                            Has predefined description
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
      
      {/* Template Dialog */}
      <AssignmentTemplateDialog
        open={dialogOpen}
        template={selectedTemplate}
        onClose={handleDialogClose}
        onSave={handleSave}
      />
      
      {/* Delete Confirmation Dialog handled by useDeleteDialog */}
      {confirmDelete}
    </Paper>
  );
};

export default AssignmentTemplateList;
