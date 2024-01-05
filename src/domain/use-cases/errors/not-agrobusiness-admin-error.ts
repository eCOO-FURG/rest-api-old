export class NotAgrobusinessAdminError extends Error {
  constructor() {
    super(`This account is not an administrator of the agribusiness.`);
  }
}
