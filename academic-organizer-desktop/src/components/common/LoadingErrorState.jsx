import React from 'react';
import { Box, CircularProgress, Alert, Button } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

/**
 * LoadingErrorState component for displaying loading spinner or error message
 */
function LoadingErrorState({ loading, error, onBackClick }) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={onBackClick}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </Box>
    );
  }

  return null;
}

export default LoadingErrorState;
