export class UnexistentRedirectCodeError extends Error {
  constructor() {
    super(`Não existe nenhum redirecionamento com esse identificador.`);
  }
}
