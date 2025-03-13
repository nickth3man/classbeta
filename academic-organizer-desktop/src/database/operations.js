const { getDb } = require('./db');
const { validateCourse, validateAssignment, validateFile } = require('./validation');
const { handleError, DatabaseError, ValidationError } = require('./errorMiddleware');

/**
 * Database operations wrapper with error handling and validation
 */
class DatabaseOperations {
  /**
   * Course operations
   */
  static async createCourse(courseData) {
    try {
      const validatedData = validateCourse(courseData);
      const db = getDb();
      
      const stmt = db.prepare(`
        INSERT INTO courses (name, code, instructor, start_date, end_date, description)
        VALUES (@name, @code, @instructor, @start_date, @end_date, @description)
      `);
      
      const result = stmt.run(validatedData);
      return { id: result.lastInsertRowid, ...validatedData };
    } catch (error) {
      throw new DatabaseError('Failed to create course', error);
    }
  }

  static async getCourse(courseId) {
    try {
      const db = getDb();
      const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
      
      if (!course) {
        throw new ValidationError('Course not found');
      }
      
      return course;
    } catch (error) {
      throw new DatabaseError('Failed to get course', error);
    }
  }

  /**
   * Assignment operations
   */
  static async createAssignment(assignmentData) {
    try {
      const validatedData = validateAssignment(assignmentData);
      const db = getDb();
      
      const stmt = db.prepare(`
        INSERT INTO assignments (course_id, title, description, due_date, status, priority)
        VALUES (@course_id, @title, @description, @due_date, @status, @priority)
      `);
      
      const result = stmt.run(validatedData);
      return { id: result.lastInsertRowid, ...validatedData };
    } catch (error) {
      throw new DatabaseError('Failed to create assignment', error);
    }
  }

  static async getAssignment(assignmentId) {
    try {
      const db = getDb();
      const assignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(assignmentId);
      
      if (!assignment) {
        throw new ValidationError('Assignment not found');
      }
      
      return assignment;
    } catch (error) {
      throw new DatabaseError('Failed to get assignment', error);
    }
  }

  /**
   * File operations
   */
  static async createFile(fileData) {
    try {
      const validatedData = validateFile(fileData);
      const db = getDb();
      
      const stmt = db.prepare(`
        INSERT INTO files (course_id, assignment_id, name, path, type, size)
        VALUES (@course_id, @assignment_id, @name, @path, @type, @size)
      `);
      
      const result = stmt.run(validatedData);
      return { id: result.lastInsertRowid, ...validatedData };
    } catch (error) {
      throw new DatabaseError('Failed to create file', error);
    }
  }

  /**
   * Transaction wrapper
   */
  static async transaction(operations) {
    const db = getDb();
    try {
      db.exec('BEGIN');
      const result = await operations();
      db.exec('COMMIT');
      return result;
    } catch (error) {
      db.exec('ROLLBACK');
      throw new DatabaseError('Transaction failed', error);
    }
  }
}

module.exports = DatabaseOperations;
