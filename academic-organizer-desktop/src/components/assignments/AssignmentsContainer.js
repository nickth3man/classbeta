import React, { useState } from 'react';
import { Box, Paper, Tabs, Tab, Button, Tooltip, IconButton } from '@mui/material';
import LowPriorityIcon from '@mui/icons-material/LowPriority';
import AddIcon from '@mui/icons-material/Add';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveAltIcon from '@mui/icons-material/SaveAlt';

import { AssignmentList } from '.';
import { AssignmentTemplateList } from '.';
import { useAssignmentsList, useAssignmentDialog, useAssignmentPriority, useTabState } from '../../hooks';

/**
 * Main container for assignment management with tabs for list and templates
 */
const AssignmentsContainer = ({ courseId = null }) => {
  // Tab state
  const { activeTab, handleTabChange } = useTabState('assignments');
  
  // Assignments data and operations
  const { 
    assignments, 
    loading, 
    error,
    refreshAssignments,
    setSelectedAssignment,
  } = useAssignmentsList({ courseId });
  
  // Assignment form dialog
  const { openAssignmentDialog } = useAssignmentDialog({
    onSave: () => refreshAssignments()
  });
  
  // Assignment priorities with drag-and-drop
  const {
    prioritizedAssignments,
    handleDragEnd,
    resetPriorities,
    loading: priorityLoading,
  } = useAssignmentPriority(assignments);
  
  // Handle creating a new assignment
  const handleCreateAssignment = (templateData = null) => {
    openAssignmentDialog(templateData);
  };
  
  // Handle clicking an assignment
  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Assignments" value="assignments" />
          <Tab label="Templates" value="templates" />
        </Tabs>
        
        <Box>
          {activeTab === 'assignments' && (
            <>
              <Tooltip title="Reset priorities to default order">
                <IconButton onClick={resetPriorities} disabled={priorityLoading}>
                  <RestartAltIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleCreateAssignment()}
                sx={{ ml: 1 }}
              >
                New Assignment
              </Button>
            </>
          )}
        </Box>
      </Box>
      
      <Paper elevation={2}>
        {activeTab === 'assignments' && (
          <Box>
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: 'background.subtle' }}>
              <LowPriorityIcon sx={{ mr: 1, color: 'text.secondary' }} />
              <Box sx={{ flexGrow: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
                Drag and drop assignments to prioritize them. Higher position = higher priority.
              </Box>
              
            </Box>
            <AssignmentList
              assignments={prioritizedAssignments}
              loading={loading || priorityLoading}
              error={error}
              onAssignmentClick={handleAssignmentClick}
              onPriorityChange={handleDragEnd}
            />
          </Box>
        )}
        
        {activeTab === 'templates' && (
          <AssignmentTemplateList 
            onCreateAssignment={(newAssignment) => {
              refreshAssignments();
              setSelectedAssignment(newAssignment);
              handleTabChange(null, 'assignments');
            }}
          />
        )}
      </Paper>
    </Box>
  );
};

export default AssignmentsContainer;
