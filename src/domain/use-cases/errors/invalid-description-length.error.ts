export class InvalidDescriptionError extends Error {
  constructor() {
    super("A descrição do produto deve ser de no máximo 200 caracteres.");
  }
}
