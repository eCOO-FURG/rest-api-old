export class InvalidScheduleDate extends Error {
  constructor() {
    super("Não é possível agendar um ciclo para o passado.");
  }
}
