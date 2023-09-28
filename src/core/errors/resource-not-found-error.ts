export class ResourceNotFoundError extends Error {
  constructor(identifier: string) {
    super(`Resource "${identifier}" was not found.`);
  }
}
