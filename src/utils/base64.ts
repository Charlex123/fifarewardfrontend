// utils/base64.ts
export const encode = (hex: string): string => {
    const buffer = Buffer.from(hex.slice(2), 'hex'); // Convert hex string to buffer
    const base64 = buffer.toString('base64'); // Convert buffer to base64 string
    const urlSafeBase64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // Make it URL-safe
  
    // Ensure the base64 encoded string is exactly 32 characters long
    return urlSafeBase64.padEnd(32, '-').slice(0, 32);
  };
  
  export const decode = (input: string): string => {
    let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const buffer = Buffer.from(base64, 'base64');
    return `0x${buffer.toString('hex')}`;
  };
  