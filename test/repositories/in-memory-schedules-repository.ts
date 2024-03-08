import { Schedule } from "@/domain/entities/schedule";
import { SchedulesRepository } from "@/domain/repositories/schedules-repository";

export class InMemorySchedulesRepository implements SchedulesRepository {
  items: Schedule[] = [];

  async save(schedule: Schedule): Promise<void> {
    this.items.push(schedule);
  }

  async check(start: Date, end: Date): Promise<Schedule | null> {
    const schedule = this.items.find((schedule) => {
      const scheduledStart = schedule.start_at.getTime();

      const duration = schedule.cycle.duration * 24 * 60 * 60 * 1000;

      const scheduledEnd = new Date(scheduledStart + duration);

      if (
        (start >= schedule.start_at && start < scheduledEnd) ||
        (start <= schedule.start_at && end >= scheduledEnd) ||
        (end > schedule.start_at && end <= scheduledEnd)
      ) {
        return schedule;
      }
    });

    if (!schedule) {
      return null;
    }

    return schedule;
  }

  async findActive(): Promise<Schedule | null> {
    const now = new Date();

    const schedule = this.items.find((item) => {
      const duration = item.cycle.duration * 24 * 60 * 60 * 1000;

      const end = new Date(item.start_at.getTime() + duration);

      return item.start_at <= now && now <= end;
    });

    if (!schedule) {
      return null;
    }

    return schedule;
  }
}
