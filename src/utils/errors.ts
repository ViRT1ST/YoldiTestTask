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

export const ERRORS: Record<string, [number, string]> = {
  zodNotEmail: [
    404, 'Valid email is required'
  ],
  zodBadEmail: [
    400, 'Email must be at least 5 characters'
  ],
  zodBadPassword: [
    400, 'Password must be at least 8 characters'
  ],
  zodBadName: [
    400, 'Name must be at least 3 characters'
  ],
  zodBadAlias: [
    400, 'Alias must be at least 3 characters'
  ],
  zodBadAbout: [
    400, 'About must be at least 1 character'
  ],
  notAllowedAlias: [
    400, 'User with this URL alias already exist'
  ],
  invalidAlias: [
    400, 'URL alias must contain only letters and numbers and cannot start with "id"'
  ],
  emailAlreadyExist: [
    400, 'User with this email already exist'
  ],
  userCreatingFailed: [
    500, 'Error creating new user'
  ],
  emailNotFound: [
    404, 'User with this email not exist'
  ],
  invalidPassword: [
    400, 'Invalid password'
  ],
  invalidOAuthInfo: [
    400, 'Invalid user info from your third party account'
  ],
  authFailed: [
    400, 'Failed to authenticate'
  ],
};
