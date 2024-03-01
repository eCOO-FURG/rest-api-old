import { User } from "@/domain/entities/user";
import { UsersRepository } from "@/domain/repositories/users-repository";
import { prisma } from "../prisma-service";
import { PrismaUserMapper } from "../mappers/prisma-user-mapper";

export class PrismaUsersRepository implements UsersRepository {
  async save(user: User): Promise<void> {
    const { account, person } = PrismaUserMapper.toPrisma(user);

    await prisma.$transaction([
      prisma.account.create({
        data: account,
      }),

      prisma.person.create({
        data: person,
      }),
    ]);
  }

  async findByEmail(email: string): Promise<User | null> {
    const account = await prisma.account.findUnique({
      where: {
        email,
      },
      include: {
        person: true,
      },
    });

    if (!account || !account.person) {
      return null;
    }

    return PrismaUserMapper.toDomain({ ...account, person: account.person });
  }
  async findByPhone(phone: string): Promise<User | null> {
    const account = await prisma.account.findUnique({
      where: {
        cellphone: phone,
      },
      include: {
        person: true,
      },
    });

    if (!account || !account.person) {
      return null;
    }

    return PrismaUserMapper.toDomain({ ...account, person: account.person });
  }
  async findByCpf(cpf: string): Promise<User | null> {
    const person = await prisma.person.findUnique({
      where: {
        cpf,
      },
      include: {
        account: true,
      },
    });

    if (!person) {
      return null;
    }

    return PrismaUserMapper.toDomain({ ...person.account, person });
  }
}
