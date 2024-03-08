import { UUID } from "@/core/entities/uuid";
import { Cycle } from "@/domain/entities/cycle";
import {
  CycleActionDay as PrismaCycleActionDay,
  Cycle as PrismaCycle,
  Prisma,
  CycleActionDay,
} from "@prisma/client";

interface DaysForAction {
  OFFERING: number[];
  ORDERING: number[];
  DISPATCHING: number[];
}

export class PrismaCycleMapper {
  static toDomain(raw: PrismaCycle & { actions: PrismaCycleActionDay[] }) {
    const daysFor: DaysForAction = {
      OFFERING: [],
      DISPATCHING: [],
      ORDERING: [],
    };

    for (const item of raw.actions) {
      const day = item.day.toNumber();
      daysFor[item.action].push(day);
    }

    return Cycle.create(
      {
        alias: raw.alias,
        offering: daysFor["OFFERING"],
        ordering: daysFor["ORDERING"],
        dispatching: daysFor["DISPATCHING"],
        duration: raw.duration.toNumber(),
        created_at: raw.created_at,
        updated_at: raw.created_at,
      },
      new UUID(raw.id)
    );
  }

  static toPrisma(cycle: Cycle): Prisma.CycleUncheckedCreateInput {
    const actions: Prisma.CycleUncheckedCreateInput["actions"] = {
      createMany: {
        data: [
          ...cycle.offering.map((day) => ({
            action: "OFFERING" as CycleActionDay["action"],
            day,
          })),
          ...cycle.ordering.map((day) => ({
            action: "ORDERING" as CycleActionDay["action"],
            day,
          })),
          ...cycle.dispatching.map((day) => ({
            action: "DISPATCHING" as CycleActionDay["action"],
            day,
          })),
        ],
      },
    };

    return {
      id: cycle.id.value,
      alias: cycle.alias,
      duration: cycle.duration,
      actions,
    };
  }
}
