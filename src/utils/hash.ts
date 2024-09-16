import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  if (!password || !hash) {
    return Promise.resolve(false);
  }

  return bcrypt.compare(password, hash);
};

export const encodeString = (text: string): string => {
  return crypto.createHash('sha256').update(text).digest('hex');
};
