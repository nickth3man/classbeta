const { initializeStorage, saveFile, loadFile, deleteFile } = require('../../src/database/secureStorage');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

describe('Secure Storage Module', () => {
  const testStorageDir = path.join(__dirname, 'test-storage');
  const testData = 'Test file content';
  let testFilePath;

  beforeAll(async () => {
    await initializeStorage(testStorageDir);
    testFilePath = path.join(testStorageDir, 'test.txt');
  });

  afterAll(async () => {
    await fs.promises.rm(testStorageDir, { recursive: true, force: true });
  });

  beforeEach(async () => {
    await fs.promises.mkdir(testStorageDir, { recursive: true });
  });

  afterEach(async () => {
    await fs.promises.rm(testStorageDir, { recursive: true, force: true });
  });

  describe('initializeStorage', () => {
    test('should create storage directory if it does not exist', async () => {
      const storageExists = await fs.promises.access(testStorageDir)
        .then(() => true)
        .catch(() => false);
      expect(storageExists).toBe(true);
    });

    test('should throw error if storage directory creation fails', async () => {
      const invalidPath = '\0invalid';
      await expect(initializeStorage(invalidPath)).rejects.toThrow();
    });
  });

  describe('saveFile', () => {
    test('should encrypt and save file content', async () => {
      await saveFile(testFilePath, testData);
      const fileExists = await fs.promises.access(testFilePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(true);

      const encryptedContent = await fs.promises.readFile(testFilePath, 'utf8');
      expect(encryptedContent).not.toBe(testData);
    });

    test('should throw error if file path is invalid', async () => {
      const invalidPath = path.join(testStorageDir, '\0invalid');
      await expect(saveFile(invalidPath, testData)).rejects.toThrow();
    });
  });

  describe('loadFile', () => {
    test('should decrypt and return file content', async () => {
      await saveFile(testFilePath, testData);
      const loadedContent = await loadFile(testFilePath);
      expect(loadedContent).toBe(testData);
    });

    test('should throw error if file does not exist', async () => {
      const nonExistentPath = path.join(testStorageDir, 'nonexistent.txt');
      await expect(loadFile(nonExistentPath)).rejects.toThrow();
    });

    test('should throw error if file content is corrupted', async () => {
      await saveFile(testFilePath, testData);
      await fs.promises.writeFile(testFilePath, 'corrupted content');
      await expect(loadFile(testFilePath)).rejects.toThrow();
    });
  });

  describe('deleteFile', () => {
    test('should securely delete file', async () => {
      await saveFile(testFilePath, testData);
      await deleteFile(testFilePath);
      const fileExists = await fs.promises.access(testFilePath)
        .then(() => true)
        .catch(() => false);
      expect(fileExists).toBe(false);
    });

    test('should not throw error if file does not exist', async () => {
      const nonExistentPath = path.join(testStorageDir, 'nonexistent.txt');
      await expect(deleteFile(nonExistentPath)).resolves.not.toThrow();
    });
  });
});