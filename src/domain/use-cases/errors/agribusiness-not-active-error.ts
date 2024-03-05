export class AgribusinessNotActiveError extends Error {
  constructor() {
    super("Este agronegócio está desativado.");
  }
}
