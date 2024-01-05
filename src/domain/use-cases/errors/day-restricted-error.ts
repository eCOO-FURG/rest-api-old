type Action = "offer" | "order";

export class DayRestrictedError extends Error {
  constructor(action: Action) {
    super(`It is not possible to ${action} products today.`);
  }
}
