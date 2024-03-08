import { Schedule } from "@/domain/entities/schedule";
import { SchedulesRepository } from "@/domain/repositories/schedules-repository";
import { prisma } from "../prisma-service";
import { PrismaScheduleMapper } from "../mappers/prisma-schedule-mapper";

export class PrismaSchedulesRepository implements SchedulesRepository {
  async save(schedule: Schedule): Promise<void> {
    const data = PrismaScheduleMapper.toPrisma(schedule);

    await prisma.$transaction(async (tsx) => {
      const cycle = await tsx.cycle.findUnique({
        where: {
          id: schedule.cycle.id.value,
        },
      });

      const duration = (cycle!.duration.toNumber() - 1) * 24 * 60 * 60 * 1000;

      const end = new Date(schedule.start_at.getTime() + duration);

      end.setHours(23, 59, 59, 999);

      await tsx.schedule.create({
        data: {
          ...data,
          end_at: end,
        },
      });
    });
  }

  async check(start: Date, end: Date): Promise<Schedule | null> {
    const data = await prisma.schedule.findFirst({
      where: {
        OR: [
          {
            AND: {
              start_at: {
                lte: start,
              },
              end_at: {
                gt: start,
              },
            },
          },
          {
            AND: {
              start_at: {
                gte: start,
              },
              end_at: {
                lte: end,
              },
            },
          },
          {
            AND: {
              start_at: {
                lt: end,
              },
              end_at: {
                gte: end,
              },
            },
          },
        ],
      },
      include: {
        cycle: {
          include: {
            actions: true,
          },
        },
      },
    });

    if (!data) {
      return null;
    }

    return PrismaScheduleMapper.toDomain(data);
  }

  async findActive(): Promise<Schedule | null> {
    const now = new Date();

    const schedule = await prisma.schedule.findFirst({
      where: {
        AND: {
          start_at: {
            lte: now,
          },
          end_at: {
            gte: now,
          },
        },
      },
      include: {
        cycle: {
          include: {
            actions: true,
          },
        },
      },
    });

    if (!schedule) {
      return null;
    }

    return PrismaScheduleMapper.toDomain(schedule);
  }
}
