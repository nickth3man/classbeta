const sqlite3 = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const { app } = require('electron').remote || require('@electron/remote');

// Get the user data directory
const userDataPath = app ? app.getPath('userData') : './data';
const dbPath = path.join(userDataPath, 'academic-organizer.db');

// Ensure the directory exists
if (!fs.existsSync(userDataPath)) {
  fs.mkdirSync(userDataPath, { recursive: true });
}

// Database connection
let db;

/**
 * Initialize the database and create tables if they don't exist
 */
function initDatabase() {
  return new Promise((resolve, reject) => {
    try {
      // Create or open the database
      db = sqlite3(dbPath);
      
      // Enable foreign keys
      db.pragma('foreign_keys = ON');
      
      // Create tables
      createTables();
      
      // Update schema if needed
      updateSchema();
      
      console.log('Database initialized successfully');
      resolve();
    } catch (error) {
      console.error('Error initializing database:', error);
      reject(error);
    }
  });
}

/**
 * Create database tables if they don't exist
 */
function createTables() {
  // Courses table
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      code TEXT,
      instructor TEXT,
      start_date TEXT,
      end_date TEXT,
      description TEXT,
      color TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Assignments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      title TEXT NOT NULL,
      description TEXT,
      due_date TEXT,
      status TEXT DEFAULT 'pending',
      priority INTEGER DEFAULT 0,
      completion_percentage INTEGER DEFAULT 0,
      created_from_template INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
      FOREIGN KEY (created_from_template) REFERENCES assignment_templates (id) ON DELETE SET NULL
    )
  `);
  
  // Assignment Templates table
  db.exec(`
    CREATE TABLE IF NOT EXISTS assignment_templates (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      defaults TEXT NOT NULL, -- JSON string containing default values
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Files table
  db.exec(`
    CREATE TABLE IF NOT EXISTS files (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      assignment_id INTEGER,
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      type TEXT,
      size INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
      FOREIGN KEY (assignment_id) REFERENCES assignments (id) ON DELETE CASCADE
    )
  `);
  
  // Notes table
  db.exec(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      assignment_id INTEGER,
      title TEXT NOT NULL,
      content TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
      FOREIGN KEY (assignment_id) REFERENCES assignments (id) ON DELETE CASCADE
    )
  `);
}

/**
 * Update database schema for existing tables if needed
 */
function updateSchema() {
  // Check if we need to update the priority field in assignments table from TEXT to INTEGER
  try {
    const priorityInfo = db.prepare(`PRAGMA table_info(assignments)`).all()
      .find(col => col.name === 'priority');
    
    if (priorityInfo && priorityInfo.type === 'TEXT') {
      console.log('Updating assignments table: converting priority from TEXT to INTEGER');
      
      // Create a backup of assignments
      db.exec(`CREATE TABLE assignments_backup AS SELECT * FROM assignments`);
      
      // Drop the original table
      db.exec(`DROP TABLE assignments`);
      
      // Recreate the table with INTEGER priority
      db.exec(`
        CREATE TABLE assignments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          course_id INTEGER,
          title TEXT NOT NULL,
          description TEXT,
          due_date TEXT,
          status TEXT DEFAULT 'pending',
          priority INTEGER DEFAULT 0,
          completion_percentage INTEGER DEFAULT 0,
          created_from_template INTEGER,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
          FOREIGN KEY (created_from_template) REFERENCES assignment_templates (id) ON DELETE SET NULL
        )
      `);
      
      // Convert priority values: 'high' -> 1, 'medium' -> 2, 'low' -> 3
      // Higher number = lower priority, so we can easily sort by priority ASC
      db.exec(`
        INSERT INTO assignments (
          id, course_id, title, description, due_date, status, 
          priority, completion_percentage, created_at, updated_at
        )
        SELECT 
          id, course_id, title, description, due_date, status,
          CASE 
            WHEN priority = 'high' THEN 1
            WHEN priority = 'medium' THEN 2
            WHEN priority = 'low' THEN 3
            ELSE 0
          END as priority,
          completion_percentage, created_at, updated_at
        FROM assignments_backup
      `);
      
      // Drop the backup table
      db.exec(`DROP TABLE assignments_backup`);
      
      console.log('Successfully updated assignments table schema');
    }
    
    // Check if we need to add the created_from_template column
    if (priorityInfo && !db.prepare(`PRAGMA table_info(assignments)`).all()
        .some(col => col.name === 'created_from_template')) {
      console.log('Adding created_from_template column to assignments table');
      db.exec(`ALTER TABLE assignments ADD COLUMN created_from_template INTEGER REFERENCES assignment_templates(id) ON DELETE SET NULL`);
    }
  } catch (error) {
    console.error('Error updating schema:', error);
    // Continue execution even if schema update fails
  }
}

/**
 * Get database instance
 */
function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
}

/**
 * Close database connection
 */
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = {
  initDatabase,
  getDb,
  closeDatabase
};
