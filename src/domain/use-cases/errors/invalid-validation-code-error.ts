export class InvalidValidationCodeError extends Error {
  constructor() {
    super(`Código inválido para validar a conta.`);
  }
}
