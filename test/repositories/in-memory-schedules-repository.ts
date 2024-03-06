import { Schedule } from "@/domain/entities/schedule";
import { SchedulesRepository } from "@/domain/repositories/schedules-repository";
import { InMemoryCyclesRepository } from "./in-memory-cycles-repository";

export class InMemorySchedulesRepository implements SchedulesRepository {
  items: Schedule[] = [];

  constructor(private inMemoryCyclesRepository: InMemoryCyclesRepository) {}

  async save(schedule: Schedule): Promise<void> {
    this.items.push(schedule);
  }

  async check(start: Date, end: Date): Promise<Schedule | null> {
    const schedule = this.items.find((schedule) => {
      const cycle = this.inMemoryCyclesRepository.items.find((cycle) =>
        cycle.id.equals(schedule.cycle_id)
      );
      if (cycle) {
        const scheduledStart = schedule.start_at.getTime();

        const duration = cycle.duration * 24 * 60 * 60 * 1000;

        const scheduledEnd = new Date(scheduledStart + duration);

        if (
          (start >= schedule.start_at && start < scheduledEnd) ||
          (start <= schedule.start_at && end >= scheduledEnd) ||
          (end > schedule.start_at && end <= scheduledEnd)
        ) {
          return schedule;
        }
      }
    });

    if (!schedule) {
      return null;
    }

    return schedule;
  }
}
