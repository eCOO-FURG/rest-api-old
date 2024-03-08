import { SchedulesRepository } from "../repositories/schedules-repository";
import { sameDay } from "../utils/same-day";
import { InvalidDayForCycleActionError } from "./errors/invalid-day-for-cycle-action-error";

interface ValidateScheduleUseCaseRequest {
  action: "offering" | "ordering" | "dispatching";
}

const mapper = {
  offering: "ofertar",
  ordering: "pedir",
  dispatching: "enviar",
};

export class ValidateScheduleUseCase {
  constructor(private schedulesRepository: SchedulesRepository) {}

  async execute({ action }: ValidateScheduleUseCaseRequest) {
    const schedule = await this.schedulesRepository.findActive();

    if (!schedule) {
      throw new InvalidDayForCycleActionError(mapper[action]);
    }

    const today = new Date();

    const offerDay = schedule.cycle[action].find((item) => {
      const day = new Date(
        schedule.start_at.getTime() + (item - 1) * 24 * 60 * 60 * 1000
      );

      return sameDay(day, today);
    });

    if (!offerDay) {
      throw new InvalidDayForCycleActionError(mapper[action]);
    }

    return schedule;
  }
}
