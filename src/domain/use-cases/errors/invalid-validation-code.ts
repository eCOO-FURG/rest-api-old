export class InvalidValidationCode extends Error {
  constructor() {
    super(`Invalid account validation code.`);
  }
}
