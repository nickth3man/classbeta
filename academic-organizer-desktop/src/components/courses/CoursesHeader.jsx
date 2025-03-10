import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Sort as SortIcon
} from '@mui/icons-material';

/**
 * CoursesHeader component for displaying the header, search, and filter controls
 * 
 * @param {Object} props
 * @param {string} props.searchQuery - Current search query
 * @param {Function} props.onSearchChange - Function to handle search query changes
 * @param {string} props.sortBy - Current sort field
 * @param {Function} props.onSortByChange - Function to handle sort field changes
 * @param {string} props.sortOrder - Current sort order ('asc' or 'desc')
 * @param {Function} props.onSortOrderToggle - Function to toggle sort order
 * @param {Function} props.onAddCourse - Function to handle add course action
 */
const CoursesHeader = ({
  searchQuery,
  onSearchChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderToggle,
  onAddCourse
}) => {
  return (
    <>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1" gutterBottom>
          Courses
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={onAddCourse}
        >
          Add Course
        </Button>
      </Box>

      {/* Filters and Search */}
      <Box display="flex" alignItems="center" mb={3} gap={2}>
        <TextField
          placeholder="Search courses..."
          variant="outlined"
          size="small"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
          }}
          sx={{ flexGrow: 1 }}
        />
        
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="sort-by-label">Sort By</InputLabel>
          <Select
            labelId="sort-by-label"
            value={sortBy}
            label="Sort By"
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <MenuItem value="name">Name</MenuItem>
            <MenuItem value="code">Code</MenuItem>
            <MenuItem value="startDate">Start Date</MenuItem>
          </Select>
        </FormControl>
        
        <Tooltip title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}>
          <IconButton 
            onClick={onSortOrderToggle}
            color="primary"
          >
            <SortIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </>
  );
};

export default CoursesHeader;
