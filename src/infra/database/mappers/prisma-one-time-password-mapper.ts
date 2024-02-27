import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OneTimePassword } from "@/domain/entities/one-time-password";
import {
  Prisma,
  OneTimePassword as PrismaOneTimePassword,
} from "@prisma/client";

export class PrismaOneTimePasswordMapper {
  static toDomain(raw: PrismaOneTimePassword) {
    return OneTimePassword.create(
      {
        account_id: new UniqueEntityID(raw.account_id),
        value: raw.value,
        used: raw.used,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    oneTimePassword: OneTimePassword
  ): Prisma.OneTimePasswordUncheckedCreateInput {
    return {
      id: oneTimePassword.id.toString(),
      account_id: oneTimePassword.account_id.toString(),
      used: oneTimePassword.used,
      value: oneTimePassword.value,
      created_at: oneTimePassword.created_at,
      updated_at: oneTimePassword.updated_at,
    };
  }
}
