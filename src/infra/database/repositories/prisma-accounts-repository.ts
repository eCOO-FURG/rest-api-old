import { Account } from "@/domain/entities/account";
import { AccountsRepository } from "@/domain/repositories/accounts-repository";
import { prisma } from "../prisma-service";
import { PrismaAccountMapper } from "../mappers/prisma-account-mapper";

export class PrismaAccountsRepository implements AccountsRepository {
  async findById(id: string): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: {
        id,
      },
    });

    if (!account) {
      return null;
    }

    return PrismaAccountMapper.toDomain(account);
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = await prisma.account.findUnique({
      where: {
        email,
      },
    });

    if (!account) {
      return null;
    }

    return PrismaAccountMapper.toDomain(account);
  }

  async save(account: Account): Promise<void> {
    const data = PrismaAccountMapper.toPrisma(account);

    await prisma.account.create({
      data,
    });
  }

  async update(account: Account): Promise<void> {
    const data = PrismaAccountMapper.toPrisma(account);

    await prisma.account.update({
      where: {
        id: account.id.toString(),
      },
      data,
    });
  }
}
