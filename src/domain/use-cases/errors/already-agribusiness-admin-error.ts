export class AlreadyAgribusinessAdminError extends Error {
  constructor() {
    super("O usuário já é administrador de outro agronegócio.");
  }
}
