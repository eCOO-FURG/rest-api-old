import { Schedule } from "../entities/schedule";

export interface SchedulesRepository {
  save(schedule: Schedule): Promise<void>;
  findActive(): Promise<Schedule | null>;
  check(start: Date, end: Date): Promise<Schedule | null>;
}
