import { UUID } from "@/core/entities/uuid";
import { OneTimePassword } from "@/domain/entities/one-time-password";
import {
  Prisma,
  OneTimePassword as PrismaOneTimePassword,
} from "@prisma/client";

export class PrismaOneTimePasswordMapper {
  static toDomain(raw: PrismaOneTimePassword) {
    return OneTimePassword.create(
      {
        user_id: new UUID(raw.account_id),
        value: raw.value,
        used: raw.used,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UUID()
    );
  }

  static toPrisma(
    oneTimePassword: OneTimePassword
  ): Prisma.OneTimePasswordUncheckedCreateInput {
    return {
      id: oneTimePassword.id.value,
      account_id: oneTimePassword.user_id.value,
      used: oneTimePassword.used,
      value: oneTimePassword.value,
      created_at: oneTimePassword.created_at,
      updated_at: oneTimePassword.updated_at,
    };
  }
}
