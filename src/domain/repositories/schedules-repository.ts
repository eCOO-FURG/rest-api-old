import { Schedule } from "../entities/schedule";

export interface SchedulesRepository {
  save(schedule: Schedule): Promise<void>;
  check(start: Date, end: Date): Promise<Schedule | null>;
}
