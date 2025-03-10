import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';

// Hooks
import {
  useCourseData,
  useAssignmentDialog,
  useNoteDialog,
  useDeleteDialog,
  useTabState,
  useFileOperations
} from '../hooks';

// Utils
import {
  formatDate,
  formatFileSize,
  getStatusColor,
  getPriorityColor
} from '../utils/formatters';

// Components
import { LoadingErrorState } from '../components/common';
import {
  CourseHeader,
  CourseInfo,
  CourseTabs,
  AssignmentDialog,
  NoteDialog,
  DeleteConfirmationDialog
} from '../components/course';

/**
 * CourseDetail page component displays detailed information about a course
 * and allows management of assignments, files, and notes
 */
function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Custom hooks
  const { 
    loading, 
    error, 
    course, 
    assignments, 
    files, 
    notes, 
    refreshData 
  } = useCourseData(id);
  
  const { tabValue, handleTabChange } = useTabState();
  
  const { 
    openDialog: openAssignmentDialog,
    formData: assignmentFormData,
    isEditing: isEditingAssignment,
    handleInputChange: handleAssignmentInputChange,
    handleAddAssignment,
    handleEditAssignment,
    handleSaveAssignment,
    closeDialog: closeAssignmentDialog
  } = useAssignmentDialog(id, refreshData);
  
  const { 
    openDialog: openNoteDialog,
    formData: noteFormData,
    isEditing: isEditingNote,
    handleInputChange: handleNoteInputChange,
    handleAddNote,
    handleEditNote,
    handleSaveNote,
    closeDialog: closeNoteDialog
  } = useNoteDialog(id, refreshData);
  
  const { 
    openDialog: openDeleteDialog,
    deleteType,
    handleOpenDeleteDialog,
    handleDeleteItem,
    closeDialog: closeDeleteDialog
  } = useDeleteDialog(refreshData);
  
  const { handleAddFile, handleDownloadFile } = useFileOperations();

  // Handle back button click
  const handleBackClick = () => {
    navigate('/courses');
  };

  // Handle edit course button click
  const handleEditCourseClick = () => {
    // Navigate back to courses page and open edit dialog
    navigate('/courses', { state: { editCourseId: course?.id } });
  };

  // Show loading or error state if necessary
  if (loading || error) {
    return (
      <LoadingErrorState 
        loading={loading} 
        error={error} 
        onBackClick={handleBackClick} 
      />
    );
  }

  return (
    <Box>
      {/* Header */}
      <CourseHeader 
        course={course} 
        onBackClick={handleBackClick} 
        onEditClick={handleEditCourseClick} 
      />

      {/* Course Info */}
      <CourseInfo 
        course={course} 
        assignments={assignments} 
        files={files} 
        notes={notes} 
        formatDate={formatDate} 
      />

      {/* Tabs */}
      <CourseTabs
        tabValue={tabValue}
        onTabChange={handleTabChange}
        assignments={assignments}
        files={files}
        notes={notes}
        onAddAssignment={handleAddAssignment}
        onEditAssignment={handleEditAssignment}
        onAddFile={handleAddFile}
        onDownloadFile={handleDownloadFile}
        onAddNote={handleAddNote}
        onEditNote={handleEditNote}
        onDeleteItem={handleOpenDeleteDialog}
        formatDate={formatDate}
        formatFileSize={formatFileSize}
        getStatusColor={getStatusColor}
        getPriorityColor={getPriorityColor}
      />

      {/* Assignment Dialog */}
      <AssignmentDialog 
        open={openAssignmentDialog}
        onClose={closeAssignmentDialog}
        onSave={handleSaveAssignment}
        formData={assignmentFormData}
        onChange={handleAssignmentInputChange}
        isEditing={isEditingAssignment}
      />

      {/* Note Dialog */}
      <NoteDialog 
        open={openNoteDialog}
        onClose={closeNoteDialog}
        onSave={handleSaveNote}
        formData={noteFormData}
        onChange={handleNoteInputChange}
        isEditing={isEditingNote}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog 
        open={openDeleteDialog}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteItem}
        itemType={deleteType}
      />
    </Box>
  );
}

export default CourseDetail;