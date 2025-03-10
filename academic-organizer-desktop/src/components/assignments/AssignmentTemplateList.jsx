import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Paper,
  Box,
  Divider,
  Button,
  Tooltip,
  Menu,
  MenuItem
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

/**
 * Component for displaying and managing assignment templates
 */
const AssignmentTemplateList = ({
  templates,
  onCreateTemplate,
  onEditTemplate,
  onDeleteTemplate,
  onUseTemplate
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Open template actions menu
  const handleOpenMenu = (event, template) => {
    setMenuAnchor(event.currentTarget);
    setSelectedTemplate(template);
  };

  // Close template actions menu
  const handleCloseMenu = () => {
    setMenuAnchor(null);
  };

  // Handle using a template to create a new assignment
  const handleUseTemplate = () => {
    onUseTemplate(selectedTemplate);
    handleCloseMenu();
  };

  // Handle editing a template
  const handleEditTemplate = () => {
    onEditTemplate(selectedTemplate);
    handleCloseMenu();
  };

  // Handle deleting a template
  const handleDeleteTemplate = () => {
    onDeleteTemplate(selectedTemplate);
    handleCloseMenu();
  };

  // If no templates, show empty state
  if (!templates || templates.length === 0) {
    return (
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Typography variant="subtitle1" color="text.secondary">
            No assignment templates
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create templates for recurring assignment types
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateTemplate}
          >
            Create Template
          </Button>
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ mb: 3 }}>
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6">Assignment Templates</Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={onCreateTemplate}
        >
          New Template
        </Button>
      </Box>
      <Divider />
      <List>
        {templates.map((template) => (
          <ListItem key={template.id} divider>
            <ListItemText
              primary={template.name}
              secondary={
                <Typography variant="body2" color="text.secondary" noWrap>
                  {template.description || `Default title: ${template.defaults.title}`}
                </Typography>
              }
            />
            <ListItemSecondaryAction>
              <Tooltip title="Use Template">
                <IconButton edge="end" onClick={() => onUseTemplate(template)}>
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton edge="end" onClick={() => onEditTemplate(template)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton edge="end" onClick={() => onDeleteTemplate(template)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="More Options">
                <IconButton edge="end" onClick={(e) => handleOpenMenu(e, template)}>
                  <MoreVertIcon />
                </IconButton>
              </Tooltip>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Template actions menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleUseTemplate}>
          Create Assignment from Template
        </MenuItem>
        <MenuItem onClick={handleEditTemplate}>Edit Template</MenuItem>
        <MenuItem onClick={handleDeleteTemplate}>Delete Template</MenuItem>
      </Menu>
    </Paper>
  );
};

AssignmentTemplateList.propTypes = {
  templates: PropTypes.array.isRequired,
  onCreateTemplate: PropTypes.func.isRequired,
  onEditTemplate: PropTypes.func.isRequired,
  onDeleteTemplate: PropTypes.func.isRequired,
  onUseTemplate: PropTypes.func.isRequired
};

export default AssignmentTemplateList;
