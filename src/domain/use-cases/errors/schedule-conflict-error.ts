export class ScheduleConflictError extends Error {
  constructor() {
    super("Já existe um ciclo agendado para esse período.");
  }
}
