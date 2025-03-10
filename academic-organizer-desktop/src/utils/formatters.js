/**
 * Utility functions for formatting data
 */

/**
 * Format date for display
 * @param {string} dateString - Date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Calculate days remaining until a date
 * @param {string} dateString - Date string to calculate days remaining for
 * @returns {string} Days remaining until the date
 */
export const getDaysRemaining = (dateString) => {
  if (!dateString) return 'No deadline';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dueDate = new Date(dateString);
  dueDate.setHours(0, 0, 0, 0);
  
  const diffTime = dueDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) return 'Overdue';
  if (diffDays === 0) return 'Due today';
  if (diffDays === 1) return 'Due tomorrow';
  return `${diffDays} days left`;
};

/**
 * Format file size for display
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Get color for assignment status
 * @param {string} status - Assignment status
 * @returns {string} MUI color name
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'success.main';
    case 'in_progress':
      return 'info.main';
    case 'not_started':
      return 'warning.main';
    case 'overdue':
      return 'error.main';
    default:
      return 'text.primary';
  }
};

/**
 * Get color for assignment priority
 * @param {string} priority - Assignment priority
 * @returns {string} MUI color name
 */
export const getPriorityColor = (priority) => {
  switch (priority) {
    case 'high':
      return 'error.main';
    case 'medium':
      return 'warning.main';
    case 'low':
      return 'success.main';
    default:
      return 'text.primary';
  }
};
