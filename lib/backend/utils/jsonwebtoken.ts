import jwt from 'jsonwebtoken';

import validator from '@/lib/backend/validator';

const expiration = process.env.JWT_EXP_SECONDS || '2592000';
const secret = process.env.JWT_SECRET || 'temporary_secret';

function generate(uuid: string): string {
  const nowDateInSeconds = Math.floor(Date.now() / 1000);
  const exp = nowDateInSeconds + parseInt(expiration, 10);

  const payload = { uuid, exp };
  const token = jwt.sign(payload, secret);

  return token;
}

function sanitize(token: unknown): string | never {
  const stringToken = validator.assertString(token);
  return stringToken.replace('Bearer ', '');
}

function verifyAndGetPayload(token: string): any | never {
  // if token is valid - returns payload
  // if token is invalid or expired - throws error
  return jwt.verify(token, secret);
};

function isValid(token: string): boolean {
  try {
    verifyAndGetPayload(token);
    return true;
  } catch {
    return false;
  }
}

export default {
  generate,
  sanitize,
  verifyAndGetPayload,
  isValid
};
