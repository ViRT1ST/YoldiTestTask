export class ExtendedError extends Error {
  public code: number | string;

  constructor(code: number | string, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export function throwError(code: number, message: string): never {
  throw new ExtendedError(code, message);
}

// export const errors = {
//   'E001': { message: 'Failed to authenticate', code: 400 },
//   'E002': { message: 'Invalid email address', code: 400 },
//   'E003': { message: 'Email must be at least 5 characters', code: 400 },
//   'E004': { message: 'Password must be at least 8 characters', code: 400 },
//   'E005': { message: 'Name must be at least 3 characters', code: 400 },
//   'E006': { message: 'User already exists', code: 400 },
//   'E007': { message: 'User not found', code: 400 },
//   'E008': { message: 'Error creating new user', code: 500 },
//   'E009': { message: 'Invalid password', code: 400 },
//   'E010': { message: 'Unknown error', code: 500 }
// };
