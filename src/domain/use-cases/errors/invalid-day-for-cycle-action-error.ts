export class InvalidDayForCycleActionError extends Error {
  constructor(action: string, cycle: string) {
    super(`Não é possível ${action} produtos para o ciclo ${cycle} hoje.`);
  }
}
