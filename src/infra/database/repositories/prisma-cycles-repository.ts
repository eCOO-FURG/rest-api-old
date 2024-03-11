import { Cycle } from "@/domain/entities/cycle";
import { CyclesRepository } from "@/domain/repositories/cycles-repository";
import { prisma } from "../prisma-service";
import { PrismaCycleMapper } from "../mappers/prisma-cycle-mapper";

export class PrismaCyclesRepository implements CyclesRepository {
  async save(cycle: Cycle): Promise<void> {
    const data = PrismaCycleMapper.toPrisma(cycle);

    await prisma.cycle.create({
      data,
    });
  }

  async findMany(): Promise<Cycle[]> {
    const data = await prisma.cycle.findMany({
      include: {
        actions: true,
      },
    });

    const cycles = data.map((item) => PrismaCycleMapper.toDomain(item));

    return cycles;
  }

  async findByAlias(alias: string): Promise<Cycle | null> {
    const cycle = await prisma.cycle.findUnique({
      where: {
        alias,
      },
      include: {
        actions: true,
      },
    });

    if (!cycle) {
      return null;
    }

    return PrismaCycleMapper.toDomain(cycle);
  }

  async findById(id: string): Promise<Cycle | null> {
    const cycle = await prisma.cycle.findUnique({
      where: {
        id,
      },
      include: {
        actions: true,
      },
    });

    if (!cycle) {
      return null;
    }

    return PrismaCycleMapper.toDomain(cycle);
  }
}
