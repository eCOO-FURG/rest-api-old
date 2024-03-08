import { PrismaCycleMapper } from "../../src/infra/database/mappers/prisma-cycle-mapper";
import { Cycle } from "../../src/domain/entities/cycle";
import { prisma } from "../../src/infra/database/prisma-service";
import { Schedule } from "../../src/domain/entities/schedule";

export async function seedSchedules() {
  const everyDay = [];

  for (let i = 1; i <= 30; i++) {
    everyDay.push(i);
  }

  const cycle = Cycle.create({
    alias: "Ciclo mensal",
    duration: 30,
    offering: everyDay,
    ordering: everyDay,
    dispatching: everyDay,
  });

  const prismaCycle = PrismaCycleMapper.toPrisma(cycle);

  const start_at = new Date();

  start_at.setHours(0, 0, 0, 0);

  const schedule = Schedule.create({
    cycle,
    start_at: new Date(),
  });

  await prisma.schedule.create({
    data: {
      start_at,
      end_at: schedule.end_at,
      cycle: {
        create: prismaCycle,
      },
    },
  });
}
