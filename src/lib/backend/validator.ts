import { z } from 'zod';

import ExtendedError from '@/lib/backend/error';

function throwError(code: number, message: string): never {
  throw new ExtendedError(code, message);
}

export function assertString(value: unknown, name: string = 'String'): string | never {
  const result = z.string().trim().min(1).safeParse(value);
  
  if (!result.success) {
    throw new ExtendedError(400, `${name} is invalid`);
  } else {
    return result.data;
  }
}

export function assertNumber(value: unknown, name: string = 'Number'): number | never {
  const result = z.coerce.number().positive().safeParse(value);

  if (!result.success) {
    throw new ExtendedError(400, `${name} is invalid`);
  } else {
    return result.data;
  }
}

export function assertName(value: unknown): string | never {
  const result = z.string().trim().min(2).max(50).safeParse(value);

  if (!result.success) {
    throw new ExtendedError(400, 'Name does not meet requirements');
  } else {
    return result.data;
  }
}

export function assertEmail(value: unknown): string | never {
  const result = z.string().trim().email().min(6).max(50).safeParse(value);

  if (!result.success) {
    throw new ExtendedError(400, 'Email does not meet requirements');
  } else {
    return result.data;
  }
}

export function assertPassword(value: unknown): string | never {
  const result = z.string().trim().min(8).max(50).safeParse(value);

  if (!result.success) {
    throw new ExtendedError(400, 'Password does not meet requirements');
  } else {
    return result.data;
  }
}

export function assertArray(value: unknown): any[] | never {
  const result = z.array(z.any()).safeParse(value);

  if (!result.success) {
    throw new ExtendedError(500, 'Invalid array');
  } else {
    return result.data;
  }
}

export default {
  throwError,
  assertString,
  assertNumber,
  assertName,
  assertEmail,
  assertPassword,
  assertArray
};