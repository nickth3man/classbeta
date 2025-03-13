const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { encryptData, decryptData, initializeEncryption } = require('./encryption');

let encryptionKey = null;

const initializeStorage = async (storageDir) => {
  try {
    await fs.promises.mkdir(storageDir, { recursive: true });
    if (!encryptionKey) {
      encryptionKey = await initializeEncryption();
    }
    return storageDir;
  } catch (error) {
    throw new Error(`Failed to initialize storage: ${error.message}`);
  }
};

const saveFile = async (filePath, content) => {
  try {
    if (!encryptionKey) {
      throw new Error('Storage not initialized');
    }

    const encryptedContent = encryptData(content, encryptionKey);
    await fs.promises.writeFile(filePath, encryptedContent, 'utf8');
  } catch (error) {
    throw new Error(`Failed to save file: ${error.message}`);
  }
};

const loadFile = async (filePath) => {
  try {
    if (!encryptionKey) {
      throw new Error('Storage not initialized');
    }

    const encryptedContent = await fs.promises.readFile(filePath, 'utf8');
    return decryptData(encryptedContent, encryptionKey);
  } catch (error) {
    throw new Error(`Failed to load file: ${error.message}`);
  }
};

const deleteFile = async (filePath) => {
  try {
    // Check if file exists
    const exists = await fs.promises.access(filePath)
      .then(() => true)
      .catch(() => false);

    if (!exists) {
      return;
    }

    // Overwrite with random data before deleting
    const fileSize = (await fs.promises.stat(filePath)).size;
    const randomData = crypto.randomBytes(fileSize);
    await fs.promises.writeFile(filePath, randomData);
    
    // Delete the file
    await fs.promises.unlink(filePath);
  } catch (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

module.exports = {
  initializeStorage,
  saveFile,
  loadFile,
  deleteFile
};