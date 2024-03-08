export class InvalidDayForCycleActionError extends Error {
  constructor(action: string) {
    super(`Não é possível ${action} produtos hoje.`);
  }
}
