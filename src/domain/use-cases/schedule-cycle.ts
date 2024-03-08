import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { CyclesRepository } from "../repositories/cycles-repository";
import { Schedule } from "../entities/schedule";
import { SchedulesRepository } from "../repositories/schedules-repository";
import { ScheduleConflictError } from "./errors/schedule-conflict-error";
import { InvalidScheduleDate } from "./errors/invalid-schedule-date";

interface ScheduleCycleUseCaseRequest {
  cycle_id: string;
  start_at: Date;
}

export class ScheduleCycleUseCase {
  constructor(
    private cyclesRepository: CyclesRepository,
    private scheduleRepository: SchedulesRepository
  ) {}

  async execute({ cycle_id, start_at }: ScheduleCycleUseCaseRequest) {
    const now = new Date();
    start_at.setHours(0, 0, 0, 0);

    if (now > start_at) {
      throw new InvalidScheduleDate();
    }

    const cycle = await this.cyclesRepository.findById(cycle_id);

    if (!cycle) {
      throw new ResourceNotFoundError("Ciclo", cycle_id);
    }

    const duration = (cycle.duration - 1) * 24 * 60 * 60 * 1000;

    const end = new Date(start_at.getTime() + duration);

    end.setHours(23, 59, 59, 999);

    const cycleInPeriod = await this.scheduleRepository.check(start_at, end);

    if (cycleInPeriod) {
      throw new ScheduleConflictError();
    }

    const schedule = Schedule.create({
      start_at,
      cycle,
    });

    await this.scheduleRepository.save(schedule);
  }
}
