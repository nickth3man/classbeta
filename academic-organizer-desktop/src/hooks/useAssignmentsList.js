import { useState, useEffect, useMemo } from 'react';
import { useAssignmentData } from './useAssignmentData';

/**
 * Custom hook for managing assignments list with filtering and sorting
 * @returns {Object} Assignment list state and handlers
 */
export const useAssignmentsList = () => {
  // Get raw assignment data
  const { assignments, loading, error } = useAssignmentData();
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Sorting state
  const [sortBy, setSortBy] = useState('due_date');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Memoize filtered and sorted assignments
  const filteredAssignments = useMemo(() => {
    if (!assignments) return [];
    
    // Apply filters
    return assignments
      .filter(assignment => {
        // Text search
        const matchesSearch = searchQuery === '' || 
          assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (assignment.description && assignment.description.toLowerCase().includes(searchQuery.toLowerCase()));
        
        // Status filter
        const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
        
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortBy === 'due_date') {
          const dateA = new Date(a.due_date || '9999-12-31');
          const dateB = new Date(b.due_date || '9999-12-31');
          return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }
        
        if (sortBy === 'title') {
          return sortOrder === 'asc' 
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        }
        
        if (sortBy === 'status') {
          return sortOrder === 'asc'
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        }
        
        return 0;
      });
  }, [assignments, searchQuery, filterStatus, sortBy, sortOrder]);
  
  // Refresh assignments (placeholder for future implementation)
  const refreshAssignments = () => {
    // This would typically trigger a data refetch
    console.log('Refreshing assignments data');
    // In a real implementation, this would call a function to refetch data
  };
  
  // Toggle sort order
  const handleSortOrderToggle = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  return {
    loading,
    error,
    assignments: filteredAssignments,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    handleSortOrderToggle,
    refreshAssignments
  };
};

export default useAssignmentsList;
