export class NotAgrobusinessAdminError extends Error {
  constructor() {
    super(`This account is not an agribusiness administrator.`);
  }
}
