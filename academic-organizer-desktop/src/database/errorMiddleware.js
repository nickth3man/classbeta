const winston = require('winston');
const path = require('path');
const { app } = require('electron').remote || require('@electron/remote');

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(app ? app.getPath('userData') : './logs', 'error.log'),
      level: 'error'
    }),
    new winston.transports.File({
      filename: path.join(app ? app.getPath('userData') : './logs', 'combined.log')
    })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

/**
 * Error types for consistent error handling
 */
class DatabaseError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'DatabaseError';
    this.originalError = originalError;
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

class FileSystemError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'FileSystemError';
    this.originalError = originalError;
  }
}

/**
 * Error handling middleware
 * @param {Error} error - The error to handle
 * @param {Object} context - Additional context about where the error occurred
 */
function handleError(error, context = {}) {
  // Log the error with context
  logger.error({
    message: error.message,
    name: error.name,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (error instanceof ValidationError) {
    return {
      success: false,
      error: error.message,
      code: 'VALIDATION_ERROR'
    };
  }

  if (error instanceof DatabaseError) {
    return {
      success: false,
      error: 'Database operation failed',
      code: 'DATABASE_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }

  if (error instanceof FileSystemError) {
    return {
      success: false,
      error: 'File system operation failed',
      code: 'FILE_SYSTEM_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    };
  }

  // Generic error response
  return {
    success: false,
    error: 'An unexpected error occurred',
    code: 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  };
}

/**
 * Recovery procedures for different error types
 */
const recoveryProcedures = {
  async handleDatabaseError(error, context) {
    logger.info('Attempting database recovery', { context });
    try {
      // Implement recovery logic (e.g., reconnect, retry)
      return true;
    } catch (recoveryError) {
      logger.error('Recovery failed', { error: recoveryError });
      return false;
    }
  },

  async handleFileSystemError(error, context) {
    logger.info('Attempting file system recovery', { context });
    try {
      // Implement recovery logic (e.g., create missing directories)
      return true;
    } catch (recoveryError) {
      logger.error('Recovery failed', { error: recoveryError });
      return false;
    }
  }
};

module.exports = {
  logger,
  handleError,
  recoveryProcedures,
  DatabaseError,
  ValidationError,
  FileSystemError
};
