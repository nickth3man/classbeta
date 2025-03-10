import React, { useState, useCallback } from 'react';
import { Box, Tabs, Tab, Typography } from '@mui/material';

// Hooks
import { 
  useAssignmentsList, 
  useAssignmentDialog, 
  useAssignmentsDeleteDialog,
  useAssignmentPriority,
  useAssignmentTemplates
} from '../hooks';

// Components
import { LoadingErrorState } from '../components/common';
import {
  AssignmentsHeader,
  AssignmentList,
  AssignmentDetail,
  AssignmentForm,
  DeleteAssignmentDialog,
  AssignmentTemplateList,
  AssignmentTemplateDialog
} from '../components/assignments';

/**
 * Assignments page component
 * Displays a list of assignments with filtering, sorting, and CRUD operations
 * Includes drag-and-drop prioritization and assignment templates
 */
function Assignments() {
  // Tab state
  const [tabValue, setTabValue] = useState(0);

  // Assignment list data and filtering/sorting
  const {
    loading,
    error,
    assignments,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    sortOrder,
    handleSortOrderToggle,
    refreshAssignments
  } = useAssignmentsList();

  // Assignment dialog (add/edit)
  const {
    dialogOpen,
    currentAssignment,
    formData,
    openAssignmentDialog,
    closeAssignmentDialog,
    handleInputChange,
    handleSaveAssignment
  } = useAssignmentDialog(refreshAssignments);

  // Delete dialog
  const {
    openDeleteDialog,
    setOpenDeleteDialog,
    selectedAssignment,
    handleOpenDeleteDialog,
    handleDeleteAssignment
  } = useAssignmentsDeleteDialog(refreshAssignments);

  // Assignment priority with drag-and-drop
  const updatePriorityInDb = useCallback(async (priorityUpdates) => {
    // In a real implementation, this would update priorities in the database
    console.log('Updating priorities:', priorityUpdates);
    // Simulate success
    return true;
  }, []);

  const {
    assignments: prioritizedAssignments,
    loading: priorityLoading,
    error: priorityError,
    handleDragEnd
  } = useAssignmentPriority(assignments, updatePriorityInDb);

  // Assignment templates
  const {
    templates,
    loading: templatesLoading,
    error: templatesError,
    selectedTemplate,
    setSelectedTemplate,
    saveTemplate,
    deleteTemplate,
    createFromTemplate
  } = useAssignmentTemplates();

  // Template dialog state
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle creating a new template
  const handleCreateTemplate = () => {
    setSelectedTemplate(null);
    setTemplateDialogOpen(true);
  };

  // Handle editing a template
  const handleEditTemplate = (template) => {
    setSelectedTemplate(template);
    setTemplateDialogOpen(true);
  };

  // Handle saving a template
  const handleSaveTemplate = async (templateData) => {
    await saveTemplate(templateData);
    setTemplateDialogOpen(false);
  };

  // Handle using a template to create a new assignment
  const handleUseTemplate = (template) => {
    // Create a new assignment with default values from the template
    // and open the assignment dialog for editing
    const newAssignment = {
      ...template.defaults,
      due_date: new Date().toISOString().split('T')[0] // Set today as default due date
    };
    
    openAssignmentDialog(newAssignment);
  };

  // Loading and error states
  if (loading || error) {
    return <LoadingErrorState loading={loading} error={error} />;
  }

  return (
    <Box p={3}>
      {/* Header with search, filters, and actions */}
      <AssignmentsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderToggle={handleSortOrderToggle}
        onAddAssignment={() => openAssignmentDialog(null)}
      />

      {/* Tabs for Assignments and Templates */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="assignment tabs">
          <Tab label="Assignments" id="assignments-tab" />
          <Tab label="Templates" id="templates-tab" />
        </Tabs>
      </Box>

      {/* Assignments Tab */}
      {tabValue === 0 && (
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Assignment list with drag-and-drop */}
          <Box sx={{ flex: '1 1 60%' }}>
            <AssignmentList
              assignments={prioritizedAssignments}
              onEdit={openAssignmentDialog}
              onDelete={handleOpenDeleteDialog}
              showCourse={true}
              onDragEnd={handleDragEnd}
            />
            {priorityLoading && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                Updating priorities...
              </Typography>
            )}
            {priorityError && (
              <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
                {priorityError}
              </Typography>
            )}
          </Box>

          {/* Assignment detail */}
          <Box sx={{ flex: '1 1 40%' }}>
            <AssignmentDetail assignment={currentAssignment} />
          </Box>
        </Box>
      )}

      {/* Templates Tab */}
      {tabValue === 1 && (
        <Box>
          <AssignmentTemplateList
            templates={templates}
            onCreateTemplate={handleCreateTemplate}
            onEditTemplate={handleEditTemplate}
            onDeleteTemplate={deleteTemplate}
            onUseTemplate={handleUseTemplate}
          />
          {templatesLoading && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Loading templates...
            </Typography>
          )}
          {templatesError && (
            <Typography variant="body2" color="error" sx={{ mt: 1, textAlign: 'center' }}>
              {templatesError}
            </Typography>
          )}
        </Box>
      )}

      {/* Assignment form dialog */}
      <AssignmentForm
        open={dialogOpen}
        onClose={closeAssignmentDialog}
        formData={formData}
        onChange={handleInputChange}
        onSave={handleSaveAssignment}
        selectedAssignment={currentAssignment}
      />

      {/* Delete confirmation dialog */}
      <DeleteAssignmentDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onDelete={handleDeleteAssignment}
        assignment={selectedAssignment}
      />

      {/* Template dialog */}
      <AssignmentTemplateDialog
        open={templateDialogOpen}
        onClose={() => setTemplateDialogOpen(false)}
        onSave={handleSaveTemplate}
        template={selectedTemplate}
        courses={[]} // TODO: Get courses from API
      />
    </Box>
  );
}

export default Assignments;
