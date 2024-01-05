export class InvalidValidationCodeError extends Error {
  constructor() {
    super(`Invalid account validation code.`);
  }
}
