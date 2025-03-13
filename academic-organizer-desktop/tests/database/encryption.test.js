const { encryptData, decryptData, initializeEncryption } = require('../../src/database/encryption');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

describe('Encryption Module', () => {
  let testKey;

  beforeAll(async () => {
    testKey = crypto.randomBytes(32).toString('hex');
  });

  describe('initializeEncryption', () => {
    const originalAppData = process.env.APPDATA;
    const testAppData = path.join(__dirname, 'test-appdata');

    beforeEach(() => {
      process.env.APPDATA = testAppData;
    });

    afterEach(async () => {
      process.env.APPDATA = originalAppData;
      await fs.promises.rm(testAppData, { recursive: true, force: true });
    });

    test('should create encryption key if none exists', async () => {
      const key = await initializeEncryption();
      expect(key).toBeDefined();
      expect(key.length).toBe(64); // 32 bytes in hex = 64 characters
    });

    test('should return existing key if present', async () => {
      const firstKey = await initializeEncryption();
      const secondKey = await initializeEncryption();
      expect(firstKey).toBe(secondKey);
    });
  });

  describe('encryptData', () => {
    test('should encrypt data with valid key', () => {
      const testData = { message: 'test data' };
      const encrypted = encryptData(testData, testKey);
      expect(encrypted).toBeDefined();
      const parsed = JSON.parse(encrypted);
      expect(parsed).toHaveProperty('iv');
      expect(parsed).toHaveProperty('data');
      expect(parsed).toHaveProperty('tag');
    });

    test('should throw error with invalid key', () => {
      const testData = { message: 'test data' };
      expect(() => encryptData(testData, 'invalid-key')).toThrow();
    });
  });

  describe('decryptData', () => {
    test('should correctly decrypt encrypted data', () => {
      const testData = { message: 'test data' };
      const encrypted = encryptData(testData, testKey);
      const decrypted = decryptData(encrypted, testKey);
      expect(decrypted).toEqual(testData);
    });

    test('should throw error with wrong key', () => {
      const testData = { message: 'test data' };
      const encrypted = encryptData(testData, testKey);
      const wrongKey = crypto.randomBytes(32).toString('hex');
      expect(() => decryptData(encrypted, wrongKey)).toThrow();
    });

    test('should throw error with corrupted data', () => {
      const testData = { message: 'test data' };
      const encrypted = encryptData(testData, testKey);
      const corrupted = encrypted.slice(0, -1) + '}';
      expect(() => decryptData(corrupted, testKey)).toThrow();
    });
  });
});