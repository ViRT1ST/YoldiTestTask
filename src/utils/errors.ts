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

