const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const Store = require('electron-store');
const { initDatabase, getDb, closeDatabase } = require('./src/database/db');

// Initialize electron-store for app settings
const store = new Store();

// Keep a global reference of the window object to prevent garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icons', 'icon.png')
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Emitted when the window is closed
  mainWindow.on('closed', () => {
    // Dereference the window object
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  // Initialize database
  await initDatabase();
  
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window when the dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Close database connection when app is about to quit
app.on('will-quit', () => {
  closeDatabase();
});

// IPC handlers for file operations
ipcMain.handle('open-file-dialog', async (event, options) => {
  const { canceled, filePaths } = await dialog.showOpenDialog(options);
  if (canceled) {
    return null;
  } else {
    return filePaths[0];
  }
});

ipcMain.handle('read-file', async (event, filePath) => {
  try {
    const data = await fs.promises.readFile(filePath);
    return data;
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
});

// IPC handlers for app settings
ipcMain.handle('get-store-value', (event, key) => {
  return store.get(key);
});

ipcMain.handle('set-store-value', (event, key, value) => {
  store.set(key, value);
  return true;
});

// IPC handlers for assignment priorities
ipcMain.handle('update-assignment-priorities', async (event, assignments) => {
  try {
    const db = getDb();
    
    // Start a transaction
    const transaction = db.transaction(() => {
      const stmt = db.prepare('UPDATE assignments SET priority = ? WHERE id = ?');
      
      // Update each assignment's priority
      for (const assignment of assignments) {
        stmt.run(assignment.priority, assignment.id);
      }
    });
    
    // Execute the transaction
    transaction();
    
    return { success: true };
  } catch (error) {
    console.error('Error updating assignment priorities:', error);
    return { success: false, error: error.message };
  }
});

// IPC handlers for assignment templates
ipcMain.handle('get-assignment-templates', async (event) => {
  try {
    const db = getDb();
    const templates = db.prepare('SELECT * FROM assignment_templates ORDER BY name').all();
    
    // Parse the defaults JSON string for each template
    return templates.map(template => ({
      ...template,
      defaults: JSON.parse(template.defaults)
    }));
  } catch (error) {
    console.error('Error getting assignment templates:', error);
    throw error;
  }
});

ipcMain.handle('save-assignment-template', async (event, template) => {
  try {
    const db = getDb();
    const { id, name, description, defaults } = template;
    
    // Convert defaults object to JSON string
    const defaultsJson = JSON.stringify(defaults);
    
    if (id) {
      // Update existing template
      const stmt = db.prepare(`
        UPDATE assignment_templates 
        SET name = ?, description = ?, defaults = ?, updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
      `);
      
      stmt.run(name, description, defaultsJson, id);
      
      // Return the updated template
      const updated = db.prepare('SELECT * FROM assignment_templates WHERE id = ?').get(id);
      return {
        ...updated,
        defaults: JSON.parse(updated.defaults)
      };
    } else {
      // Insert new template
      const stmt = db.prepare(`
        INSERT INTO assignment_templates (name, description, defaults) 
        VALUES (?, ?, ?)
      `);
      
      const result = stmt.run(name, description, defaultsJson);
      
      // Return the new template with ID
      const newTemplate = db.prepare('SELECT * FROM assignment_templates WHERE id = ?').get(result.lastInsertRowid);
      return {
        ...newTemplate,
        defaults: JSON.parse(newTemplate.defaults)
      };
    }
  } catch (error) {
    console.error('Error saving assignment template:', error);
    throw error;
  }
});

ipcMain.handle('delete-assignment-template', async (event, templateId) => {
  try {
    const db = getDb();
    
    // Delete the template
    const stmt = db.prepare('DELETE FROM assignment_templates WHERE id = ?');
    stmt.run(templateId);
    
    return { success: true };
  } catch (error) {
    console.error('Error deleting assignment template:', error);
    throw error;
  }
});

ipcMain.handle('create-assignment-from-template', async (event, { templateId, overrides }) => {
  try {
    const db = getDb();
    
    // Get the template
    const template = db.prepare('SELECT * FROM assignment_templates WHERE id = ?').get(templateId);
    
    if (!template) {
      throw new Error('Template not found');
    }
    
    // Parse the defaults
    const defaults = JSON.parse(template.defaults);
    
    // Combine defaults with overrides
    const assignmentData = {
      ...defaults,
      ...overrides,
      created_from_template: templateId
    };
    
    // Insert the new assignment
    const { course_id, title, description, due_date, status, priority, completion_percentage } = assignmentData;
    
    const stmt = db.prepare(`
      INSERT INTO assignments (
        course_id, title, description, due_date, status, 
        priority, completion_percentage, created_from_template
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      course_id, title, description, due_date, status || 'pending', 
      priority || 0, completion_percentage || 0, templateId
    );
    
    // Return the new assignment
    const newAssignment = db.prepare('SELECT * FROM assignments WHERE id = ?').get(result.lastInsertRowid);
    return newAssignment;
  } catch (error) {
    console.error('Error creating assignment from template:', error);
    throw error;
  }
});
