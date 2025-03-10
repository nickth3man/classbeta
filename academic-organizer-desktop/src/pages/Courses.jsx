import React from 'react';
import { Box } from '@mui/material';

// Hooks
import { 
  useCoursesList, 
  useCourseDialog, 
  useCoursesDeleteDialog 
} from '../hooks';

// Components
import { LoadingErrorState } from '../components/common';
import {
  CoursesHeader,
  CoursesGrid,
  CourseDialog,
  DeleteCourseDialog
} from '../components/courses';

/**
 * Courses page component
 * Displays a list of courses with filtering and sorting options
 */
function Courses() {
  // Course list data and filtering/sorting
  const {
    loading,
    filteredCourses,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    refreshCourses
  } = useCoursesList();

  // Course dialog (add/edit)
  const {
    openDialog,
    setOpenDialog,
    selectedCourse,
    formData,
    handleInputChange,
    handleAddCourse,
    handleEditCourse,
    handleSaveCourse
  } = useCourseDialog(refreshCourses);

  // Delete dialog
  const {
    openDeleteDialog,
    setOpenDeleteDialog,
    selectedCourse: courseToDelete,
    handleOpenDeleteDialog,
    handleDeleteCourse
  } = useCoursesDeleteDialog(refreshCourses);

  // Toggle sort order
  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (loading) {
    return <LoadingErrorState loading={loading} />;
  }

  return (
    <Box>
      {/* Header with search and filters */}
      <CoursesHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        sortOrder={sortOrder}
        onSortOrderToggle={handleSortOrderToggle}
        onAddCourse={handleAddCourse}
      />

      {/* Courses Grid */}
      <CoursesGrid
        courses={filteredCourses}
        onEdit={handleEditCourse}
        onDelete={handleOpenDeleteDialog}
        searchQuery={searchQuery}
        onAddCourse={handleAddCourse}
      />

      {/* Add/Edit Course Dialog */}
      <CourseDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        formData={formData}
        onChange={handleInputChange}
        onSave={handleSaveCourse}
        selectedCourse={selectedCourse}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteCourseDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onDelete={handleDeleteCourse}
        course={courseToDelete}
      />
    </Box>
  );
}

export default Courses;
