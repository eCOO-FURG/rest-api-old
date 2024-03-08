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

    const schedule = Schedule.create({
      start_at,
      cycle,
    });

    const cycleInPeriod = await this.scheduleRepository.check(
      start_at,
      schedule.end_at
    );

    if (cycleInPeriod) {
      throw new ScheduleConflictError();
    }

    await this.scheduleRepository.save(schedule);
  }
}
