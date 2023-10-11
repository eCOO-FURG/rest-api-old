export class AccountNotVerified extends Error {
  constructor() {
    super(`Account is not verified.`);
  }
}
