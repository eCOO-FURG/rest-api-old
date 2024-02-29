export class AlreadyAgribusinessAdminError extends Error {
  constructor() {
    super("User is already an administrator of another agribusiness");
  }
}
