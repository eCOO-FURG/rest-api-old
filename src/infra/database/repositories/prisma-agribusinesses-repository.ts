import { Agribusiness } from "@/domain/entities/agribusiness";
import { AgribusinessesRepository } from "@/domain/repositories/agribusinesses-repository";
import { prisma } from "../prisma-service";
import { PrismaAgribusinessMapper } from "../mappers/prisma-agribusiness-mapper";

export class PrismaAgribusinessesRepository
  implements AgribusinessesRepository
{
  async findByCaf(caf: string): Promise<Agribusiness | null> {
    const agribusiness = await prisma.agribusiness.findUnique({
      where: {
        caf,
      },
    });

    if (!agribusiness) {
      return null;
    }

    return PrismaAgribusinessMapper.toDomain(agribusiness);
  }

  async findById(id: string): Promise<Agribusiness | null> {
    const agribusiness = await prisma.agribusiness.findUnique({
      where: {
        id,
      },
    });

    if (!agribusiness) {
      return null;
    }

    return PrismaAgribusinessMapper.toDomain(agribusiness);
  }

  async findByAdminId(admin_id: string): Promise<Agribusiness | null> {
    const agribusiness = await prisma.agribusiness.findUnique({
      where: {
        admin_id,
      },
    });

    if (!agribusiness) {
      return null;
    }

    return PrismaAgribusinessMapper.toDomain(agribusiness);
  }

  async findAllSortedByName(
    page: number,
    pageSize: number = 20
  ): Promise<Agribusiness[]> {
    const skip = (page - 1) * pageSize;

    const agribusinesses = await prisma.agribusiness.findMany({
      orderBy: {
        name: "asc",
      },
      skip,
      take: pageSize,
    });

    const mappedAgribusiness = agribusinesses.map((agribusiness) =>
      PrismaAgribusinessMapper.toDomain(agribusiness)
    );
    return mappedAgribusiness;
  }

  async save(agribusiness: Agribusiness): Promise<void> {
    const data = PrismaAgribusinessMapper.toPrisma(agribusiness);

    await prisma.agribusiness.create({
      data,
    });
  }

  async update(agribusiness: Agribusiness): Promise<void> {
    const data = PrismaAgribusinessMapper.toPrisma(agribusiness);

    await prisma.agribusiness.update({
      where: {
        id: agribusiness.id.value,
      },
      data,
    });
  }
}
