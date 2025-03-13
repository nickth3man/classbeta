// Jest setup file
const { ipcRenderer } = require('electron');

// Mock Electron's ipcRenderer
jest.mock('electron', () => ({
  ipcRenderer: {
    invoke: jest.fn(),
    on: jest.fn(),
    removeListener: jest.fn()
  }
}));

// Reset all mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});

// Global test helpers
global.mockIpcSuccess = (responseData) => {
  ipcRenderer.invoke.mockResolvedValue(responseData);
};

global.mockIpcError = (errorMessage) => {
  ipcRenderer.invoke.mockRejectedValue(new Error(errorMessage));
};
