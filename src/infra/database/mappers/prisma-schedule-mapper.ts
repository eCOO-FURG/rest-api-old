import { UUID } from "@/core/entities/uuid";
import { Schedule } from "@/domain/entities/schedule";
import { Prisma, Schedule as PrismaSchedule } from "@prisma/client";

export class PrismaScheduleMapper {
  static toDomain(raw: PrismaSchedule) {
    return Schedule.create(
      {
        cycle_id: new UUID(raw.cycle_id),
        start_at: raw.start_at,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UUID(raw.id)
    );
  }

  static toPrisma(
    schedule: Schedule
  ): Omit<Prisma.ScheduleUncheckedCreateInput, "end_at"> {
    return {
      id: schedule.id.value,
      start_at: schedule.start_at,
      cycle_id: schedule.cycle_id.value,
      created_at: schedule.created_at,
      updated_at: schedule.updated_at,
    };
  }
}
