export class ResourceAlreadyExistsError extends Error {
  constructor(identifier: string) {
    super(`"${identifier}" already exists.`);
  }
}
