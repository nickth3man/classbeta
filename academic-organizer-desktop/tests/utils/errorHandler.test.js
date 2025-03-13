const ErrorHandler = require('../../src/utils/errorHandler');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

jest.mock('electron', () => ({
  app: {
    getPath: jest.fn(() => 'test-user-data')
  }
}));

jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  promises: {
    appendFile: jest.fn(),
    readFile: jest.fn(),
    writeFile: jest.fn()
  },
  existsSync: jest.fn(),
  mkdirSync: jest.fn()
}));

describe('ErrorHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fs.existsSync.mockReturnValue(true);
  });

  describe('logError', () => {
    test('should log error with timestamp and context', async () => {
      const error = new Error('Test error');
      const context = { userId: '123' };

      const result = await ErrorHandler.logError(error, context);

      expect(fs.promises.appendFile).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({
        timestamp: expect.any(String),
        error: expect.objectContaining({
          message: 'Test error',
          stack: expect.any(String),
          name: 'Error'
        }),
        context: context
      }));
    });
  });

  describe('getErrorLogs', () => {
    test('should return parsed error logs', async () => {
      const mockLogs = [
        { timestamp: '2023-01-01', error: { message: 'Error 1' } },
        { timestamp: '2023-01-02', error: { message: 'Error 2' } }
      ].map(log => JSON.stringify(log)).join('\n');

      fs.promises.readFile.mockResolvedValue(mockLogs);

      const logs = await ErrorHandler.getErrorLogs();

      expect(logs).toHaveLength(2);
      expect(logs[0].error.message).toBe('Error 1');
      expect(logs[1].error.message).toBe('Error 2');
    });

    test('should return empty array if log file does not exist', async () => {
      fs.existsSync.mockReturnValue(false);

      const logs = await ErrorHandler.getErrorLogs();

      expect(logs).toEqual([]);
    });
  });

  describe('clearErrorLogs', () => {
    test('should clear error logs', async () => {
      await ErrorHandler.clearErrorLogs();

      expect(fs.promises.writeFile).toHaveBeenCalledWith(
        expect.any(String),
        '',
        'utf8'
      );
    });
  });
});
