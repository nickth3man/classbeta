const { sanitizeHtml } = require('sanitize-html');

/**
 * Validates course data
 * @param {Object} courseData - The course data to validate
 * @returns {Object} - Validated and sanitized course data
 * @throws {Error} - If validation fails
 */
function validateCourse(courseData) {
  if (!courseData.name || courseData.name.trim() === '') {
    throw new Error('Course name is required');
  }

  // Validate dates if provided
  if (courseData.start_date && !isValidDate(courseData.start_date)) {
    throw new Error('Invalid start date format');
  }
  if (courseData.end_date && !isValidDate(courseData.end_date)) {
    throw new Error('Invalid end date format');
  }

  // Sanitize text fields
  return {
    ...courseData,
    name: sanitizeHtml(courseData.name, { allowedTags: [] }),
    description: courseData.description ? sanitizeHtml(courseData.description, { allowedTags: [] }) : null,
    instructor: courseData.instructor ? sanitizeHtml(courseData.instructor, { allowedTags: [] }) : null
  };
}

/**
 * Validates assignment data
 * @param {Object} assignmentData - The assignment data to validate
 * @returns {Object} - Validated and sanitized assignment data
 * @throws {Error} - If validation fails
 */
function validateAssignment(assignmentData) {
  if (!assignmentData.title || assignmentData.title.trim() === '') {
    throw new Error('Assignment title is required');
  }

  // Validate priority
  if (assignmentData.priority !== undefined) {
    const priority = parseInt(assignmentData.priority);
    if (isNaN(priority) || priority < 0 || priority > 3) {
      throw new Error('Invalid priority value');
    }
  }

  // Validate status
  const validStatuses = ['pending', 'in_progress', 'completed', 'late'];
  if (assignmentData.status && !validStatuses.includes(assignmentData.status)) {
    throw new Error('Invalid status value');
  }

  // Validate due date if provided
  if (assignmentData.due_date && !isValidDate(assignmentData.due_date)) {
    throw new Error('Invalid due date format');
  }

  // Sanitize text fields
  return {
    ...assignmentData,
    title: sanitizeHtml(assignmentData.title, { allowedTags: [] }),
    description: assignmentData.description ? sanitizeHtml(assignmentData.description, { allowedTags: [] }) : null
  };
}

/**
 * Validates file data
 * @param {Object} fileData - The file data to validate
 * @returns {Object} - Validated file data
 * @throws {Error} - If validation fails
 */
function validateFile(fileData) {
  if (!fileData.name || fileData.name.trim() === '') {
    throw new Error('File name is required');
  }

  // Validate file size (max 50MB)
  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
  if (fileData.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds limit');
  }

  // Validate file type
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif'
  ];

  if (!allowedTypes.includes(fileData.type)) {
    throw new Error('Invalid file type');
  }

  return {
    ...fileData,
    name: sanitizeHtml(fileData.name, { allowedTags: [] })
  };
}

/**
 * Validates date string format
 * @param {string} dateString - The date string to validate
 * @returns {boolean} - True if date is valid
 */
function isValidDate(dateString) {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

module.exports = {
  validateCourse,
  validateAssignment,
  validateFile
};