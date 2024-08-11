import { z } from 'zod';

import {
  DbUserSchema,
  DbUser,
} from '@/lib/types';

import ExtendedError from '@/lib/backend/error';

function throwError(code: number, message: string): never {
  throw new ExtendedError(code, message);
}

function checkUserIsAdmin(user: DbUser): void | never {
  if (!user.is_admin) {
    throw new ExtendedError(403, 'You do not have permission to this action.');
  }
}

function assertString(value: unknown, name: string = 'String'): string | never {
  const result = z.string().trim().safeParse(value);

  if (!result.success) {
    throw new ExtendedError(400, `${name} is invalid.`);
  }
  
  return result.data;
}

function assertNumber(value: unknown, name: string = 'Number'): number | never {
  const result = z.coerce.number().positive().safeParse(value);

  if (!result.success) {
    throw new ExtendedError(400, `${name} is invalid.`);
  }
  
  return result.data;
}

function assertEmail(value: unknown): string | never {
  const result = z.string().trim().email().safeParse(value);

  if (!result.success) {
    throw new ExtendedError(400, 'Email does not meet requirements.');
  }
  
  return result.data;
}

function assertPassword(value: unknown): string | never {
  const result = z.string().trim().min(8).safeParse(value);

  if (!result.success) {
    throw new ExtendedError(400, 'Password does not meet requirements.');
  }

  return result.data;
}

function assertUser(value: unknown): DbUser | never {
  const result = DbUserSchema.safeParse(value);

  if (!result.success) {
    throw new ExtendedError(400, 'User data is invalid.');
  } else {
    return result.data;
  }
}

function assertArray(value: unknown): any[] | never {
  const result = z.array(z.any()).safeParse(value);

  if (!result.success) {
    throw new ExtendedError(500, 'Invalid array.');
  } else {
    return result.data;
  }
}



export default {
  throwError,
  checkUserIsAdmin,
  assertString,
  assertNumber,
  assertEmail,
  assertPassword,
  assertUser,
  assertArray,
};
