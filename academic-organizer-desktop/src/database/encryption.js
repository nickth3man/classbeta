const crypto = require('crypto');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const ENCRYPTION_ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32; // 256 bits
const IV_LENGTH = 16; // 128 bits
const AUTH_TAG_LENGTH = 16; // 128 bits

const generateKey = () => {
  return crypto.randomBytes(KEY_LENGTH);
};

const initializeEncryption = async () => {
  try {
    const keyPath = path.join(process.env.APPDATA, 'academic-organizer', 'encryption.key');
    
    // Ensure directory exists
    await fs.promises.mkdir(path.dirname(keyPath), { recursive: true });
    
    try {
      // Try to read existing key
      const existingKey = await fs.promises.readFile(keyPath);
      return existingKey.toString('hex');
    } catch (error) {
      // Generate and save new key if none exists
      const newKey = generateKey();
      await fs.promises.writeFile(keyPath, newKey);
      return newKey.toString('hex');
    }
  } catch (error) {
    throw new Error('Failed to initialize encryption: ' + error.message);
  }
};

const encryptData = (data, keyHex) => {
  try {
    const key = Buffer.from(keyHex, 'hex');
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ENCRYPTION_ALGORITHM, key, iv);
    
    const serializedData = JSON.stringify(data);
    let encrypted = cipher.update(serializedData, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    // Combine IV, encrypted data, and auth tag
    return JSON.stringify({
      iv: iv.toString('hex'),
      data: encrypted,
      tag: authTag.toString('hex')
    });
  } catch (error) {
    throw new Error('Encryption failed: ' + error.message);
  }
};

const decryptData = (encryptedData, keyHex) => {
  try {
    const key = Buffer.from(keyHex, 'hex');
    const { iv, data, tag } = JSON.parse(encryptedData);
    
    const decipher = crypto.createDecipheriv(
      ENCRYPTION_ALGORITHM,
      key,
      Buffer.from(iv, 'hex')
    );
    
    decipher.setAuthTag(Buffer.from(tag, 'hex'));
    
    let decrypted = decipher.update(data, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  } catch (error) {
    throw new Error('Decryption failed: ' + error.message);
  }
};

module.exports = {
  encryptData,
  decryptData,
  initializeEncryption
};
