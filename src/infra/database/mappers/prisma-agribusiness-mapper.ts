import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Agribusiness } from "@/domain/entities/agribusiness";
import { Prisma, Agribusiness as PrismaAgribusiness } from "@prisma/client";

export class PrismaAgribusinessMapper {
  static toDomain(raw: PrismaAgribusiness) {
    return Agribusiness.create(
      {
        name: raw.name,
        caf: raw.caf,
        active: raw.active,
        admin_id: new UniqueEntityID(raw.admin_id),
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    agribusiness: Agribusiness
  ): Prisma.AgribusinessUncheckedCreateInput {
    return {
      id: agribusiness.id.toString(),
      name: agribusiness.name,
      caf: agribusiness.caf,
      active: agribusiness.active,
      admin_id: agribusiness.admin_id.toString(),
      created_at: agribusiness.created_at,
      updated_at: agribusiness.updated_at,
    };
  }
}
