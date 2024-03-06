export class InvalidCycleError extends Error {
  constructor(action: string) {
    super(`Dias para ${action} produtos estão fora do escopo do ciclo.`);
  }
}
