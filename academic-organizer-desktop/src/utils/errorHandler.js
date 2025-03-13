const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class ErrorHandler {
  constructor() {
    this.logDir = path.join(app.getPath('userData'), 'logs');
    this.logFile = path.join(this.logDir, 'error.log');
    this.setupLogDirectory();
  }

  setupLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  async logError(error, context = {}) {
    const timestamp = new Date().toISOString();
    const errorLog = {
      timestamp,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name
      },
      context
    };

    const logEntry = JSON.stringify(errorLog) + '\n';

    try {
      await fs.promises.appendFile(this.logFile, logEntry, 'utf8');
    } catch (err) {
      console.error('Failed to write to error log:', err);
    }

    return errorLog;
  }

  async getErrorLogs(limit = 50) {
    try {
      if (!fs.existsSync(this.logFile)) {
        return [];
      }

      const content = await fs.promises.readFile(this.logFile, 'utf8');
      return content
        .trim()
        .split('\n')
        .map(line => JSON.parse(line))
        .slice(-limit);
    } catch (err) {
      console.error('Failed to read error logs:', err);
      return [];
    }
  }

  async clearErrorLogs() {
    try {
      await fs.promises.writeFile(this.logFile, '', 'utf8');
    } catch (err) {
      console.error('Failed to clear error logs:', err);
    }
  }
}

module.exports = new ErrorHandler();