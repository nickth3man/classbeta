const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    // File operations
    openFileDialog: (options) => ipcRenderer.invoke('open-file-dialog', options),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    
    // Store operations
    getStoreValue: (key) => ipcRenderer.invoke('get-store-value', key),
    setStoreValue: (key, value) => ipcRenderer.invoke('set-store-value', key, value),
    
    // App info
    getAppVersion: () => process.env.npm_package_version,
  }
);
