export class InvalidCycleError extends Error {
  constructor(action: string) {
    super(`Os dias para ${action} produtos estão fora da duração do ciclo.`);
  }
}
