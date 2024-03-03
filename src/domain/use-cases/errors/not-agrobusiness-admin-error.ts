export class NotAgrobusinessAdminError extends Error {
  constructor() {
    super(`Esse usuário não é administrador de um agronegócio.`);
  }
}
