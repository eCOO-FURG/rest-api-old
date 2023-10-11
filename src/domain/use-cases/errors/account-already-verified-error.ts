export class AccountAlreadyVerified extends Error {
  constructor() {
    super(`Account already verified.`);
  }
}
