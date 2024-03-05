export class ResourceAlreadyExistsError extends Error {
  constructor(name: string, value: string) {
    super(`${name} ${value} já existe.`);
  }
}
