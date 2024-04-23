export class PasswordNotSettedError extends Error {
  constructor() {
    super(`Esse usuário não não tem uma senha configurada.`);
  }
}
