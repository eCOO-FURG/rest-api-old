import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Person } from "@/domain/entities/person";
import { Cpf } from "@/domain/entities/value-objects/cpf";
import { Person as PrismaPerson, Prisma } from "@prisma/client";
import { raw } from "@prisma/client/runtime/library";

export class PrismaPersonMapper {
  static toDomain(raw: PrismaPerson) {
    return Person.create(
      {
        first_name: raw.first_name,
        last_name: raw.last_name,
        cpf: Cpf.createFromText(raw.cpf),
        account_id: new UniqueEntityID(raw.account_id),
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(person: Person): Prisma.PersonUncheckedCreateInput {
    return {
      id: person.id.toString(),
      first_name: person.first_name,
      last_name: person.last_name,
      cpf: person.cpf.value,
      account_id: person.account_id.toString(),
      created_at: person.created_at,
      updated_at: person.updated_at,
    };
  }
}
