export default class ExtendedError extends Error {
  public code: number;

  constructor(code: number, message: string) {
    // base constructor only accepts string message as an argument
    // we extend it here to accept other values, allowing us to pass other data
    super(message);
    this.code = code;
  }
}
