export class SamePaswordError extends Error {
  constructor() {
    super(`Essa senha já é atual.`);
  }
}
