import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Account } from "@/domain/entities/account";
import { Account as PrismaAccount, Prisma } from "@prisma/client";

export class PrismaAccountMapper {
  static toDomain(raw: PrismaAccount) {
    return Account.create(
      {
        email: raw.email,
        password: raw.password,
        verified_at: raw.verified_at,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(account: Account): Prisma.AccountUncheckedCreateInput {
    return {
      id: account.id.toString(),
      email: account.email,
      password: account.password,
      verified_at: account.verified_at,
      created_at: account.created_at,
      updated_at: account.updated_at,
    };
  }
}
