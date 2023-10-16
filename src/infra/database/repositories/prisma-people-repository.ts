import { Person } from "@/domain/entities/person";
import { Cpf } from "@/domain/entities/value-objects/cpf";
import { PeopleRepository } from "@/domain/repositories/people-repository";
import { prisma } from "../prisma-service";
import { PrismaPersonMapper } from "../mappers/prisma-person-mapper";

export class PrismaPeopleRepository implements PeopleRepository {
  async findByAccountId(account_id: string): Promise<Person | null> {
    const person = await prisma.person.findUnique({
      where: {
        account_id,
      },
    });

    if (!person) {
      return null;
    }

    return PrismaPersonMapper.toDomain(person);
  }

  async findByCpf(cpf: Cpf): Promise<Person | null> {
    const person = await prisma.person.findUnique({
      where: {
        cpf: cpf.value,
      },
    });

    if (!person) {
      return null;
    }

    return PrismaPersonMapper.toDomain(person);
  }

  async save(person: Person): Promise<void> {
    const data = PrismaPersonMapper.toPrisma(person);

    await prisma.person.create({
      data,
    });
  }
}
