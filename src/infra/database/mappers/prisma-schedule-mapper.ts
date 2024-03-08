import { UUID } from "@/core/entities/uuid";
import { Schedule } from "@/domain/entities/schedule";
import {
  CycleActionDay as PrismaCycleActionDay,
  Schedule as PrismaSchedule,
  Cycle as PrismaCycle,
  Prisma,
} from "@prisma/client";
import { PrismaCycleMapper } from "./prisma-cycle-mapper";

export class PrismaScheduleMapper {
  static toDomain(
    raw: PrismaSchedule & {
      cycle: PrismaCycle & { actions: PrismaCycleActionDay[] };
    }
  ) {
    return Schedule.create(
      {
        start_at: raw.start_at,
        cycle: PrismaCycleMapper.toDomain(raw.cycle),
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
      cycle_id: schedule.cycle.id.value,
      created_at: schedule.created_at,
      updated_at: schedule.updated_at,
    };
  }
}
