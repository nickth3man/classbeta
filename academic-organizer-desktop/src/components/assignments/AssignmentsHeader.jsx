import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Grid,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Sort as SortIcon,
} from '@mui/icons-material';

/**
 * Header component for the Assignments page
 * Includes search, filters, and action buttons
 * 
 * @param {Object} props - Component props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onSearchChange - Handler for search query changes
 * @param {string} props.sortBy - Current sort field
 * @param {Function} props.onSortByChange - Handler for sort field changes
 * @param {string} props.sortOrder - Current sort order ('asc' or 'desc')
 * @param {Function} props.onSortOrderToggle - Handler for toggling sort order
 * @param {Function} props.onAddAssignment - Handler for adding new assignment
 * @param {string} props.filterStatus - Current status filter
 * @param {Function} props.onFilterStatusChange - Handler for status filter changes
 */
const AssignmentsHeader = ({
  searchQuery = '',
  onSearchChange,
  sortBy = 'due_date',
  onSortByChange,
  sortOrder = 'asc',
  onSortOrderToggle,
  onAddAssignment,
  filterStatus = 'all',
  onFilterStatusChange,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center" sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" component="h1">
            Assignments
          </Typography>
        </Grid>
        <Grid item xs={12} md={6} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onAddAssignment}
          >
            New Assignment
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} alignItems="center">
        {/* Search field */}
        <Grid item xs={12} md={4}>
          <TextField
            fullWidth
            placeholder="Search assignments..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>

        {/* Status filter */}
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={filterStatus}
              label="Status"
              onChange={(e) => onFilterStatusChange(e.target.value)}
            >
              <MenuItem value="all">All Statuses</MenuItem>
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Sort controls */}
        <Grid item xs={12} sm={4} md={3}>
          <FormControl fullWidth size="small">
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={sortBy}
              label="Sort By"
              onChange={(e) => onSortByChange(e.target.value)}
            >
              <MenuItem value="title">Title</MenuItem>
              <MenuItem value="due_date">Due Date</MenuItem>
              <MenuItem value="status">Status</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/* Sort order toggle */}
        <Grid item xs={12} sm={4} md={2} sx={{ textAlign: 'center' }}>
          <Tooltip title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}>
            <IconButton
              onClick={onSortOrderToggle}
              color="primary"
              sx={{ transform: sortOrder === 'desc' ? 'rotate(180deg)' : 'none' }}
            >
              <SortIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AssignmentsHeader;
