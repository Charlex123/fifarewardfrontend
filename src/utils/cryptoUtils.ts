// utils/encryption.ts
import crypto from 'crypto';

// Create a persistent hash map
let hashMap: { [key: string]: string } = {};

export const encrypt = (text: string): string => {
  const hash = crypto.randomBytes(9).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 12);
  hashMap[hash] = text; // Store the mapping
  return hash;
};

export const decrypt = (hash: string): string => {
  return hashMap[hash] || 'Decryption failed';
};

// Function to get the hash map (for testing purposes)
export const getHashMap = (): { [key: string]: string } => {
  return hashMap;
};

// Function to reset the hash map (for testing purposes)
export const resetHashMap = () => {
  hashMap = {};
};
