export class SessionExpiredError extends Error {
  constructor() {
    super(`A sessão expirou.`);
  }
}
