import React from 'react';
import { useAssignmentData } from '../hooks/useAssignmentData';
import { useAssignmentDialog } from '../hooks/useAssignmentDialog';
import AssignmentList from '../components/assignments/AssignmentList';
import AssignmentForm from '../components/assignments/AssignmentForm';
import { Button, Box, Grid } from '@mui/material';

const Assignments = () => {
  const { assignments, loading, error } = useAssignmentData();
  const { dialogOpen, currentAssignment, openAssignmentDialog, closeAssignmentDialog } = useAssignmentDialog();

  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData);
    closeAssignmentDialog();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading assignments.</div>;

  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Button 
            variant="contained" 
            onClick={() => openAssignmentDialog()}
            sx={{ mb: 2 }}
          >
            New Assignment
          </Button>
          <AssignmentList 
            assignments={assignments} 
            onEdit={openAssignmentDialog}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <AssignmentDetail assignment={currentAssignment} />
        </Grid>
      </Grid>

      <AssignmentForm
        open={dialogOpen}
        onClose={closeAssignmentDialog}
        onSubmit={handleSubmit}
        initialData={currentAssignment}
      />
    </Box>
  );
};

export default Assignments;
