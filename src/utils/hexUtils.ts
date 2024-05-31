// utils/hexUtils.ts
const BASE52_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

const base52Encode = (input: string): string => {
  let num = BigInt('0x' + input);
  let encoded = '';
  const base = BigInt(BASE52_ALPHABET.length);
  while (num > 0) {
    const remainder = num % base;
    num = num / base;
    encoded = BASE52_ALPHABET[Number(remainder)] + encoded;
  }
  return encoded;
};

const base52Decode = (input: string): string => {
  let num = BigInt(0);
  const base = BigInt(BASE52_ALPHABET.length);
  for (let i = 0; i < input.length; i++) {
    num = num * base + BigInt(BASE52_ALPHABET.indexOf(input[i]));
  }
  return num.toString(16);
};

export const encode = (hexStr: string): string => {
  const cleanHexStr = hexStr.replace(/^0x/, '');
  const encoded = base52Encode(cleanHexStr);
  return encoded.padStart(32, 'A').substring(0, 32);
};

export const decode = (alphabeticStr: string): string => {
  const decoded = base52Decode(alphabeticStr);
  return `0x${decoded.padStart(40, '0')}`;
};
