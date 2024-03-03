export class ResourceNotFoundError extends Error {
  constructor(name: string, value: string) {
    super(`"${name} ${value}" não existe.`);
  }
}
