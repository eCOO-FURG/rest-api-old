import { UUID } from "@/core/entities/uuid";
import { User } from "@/domain/entities/user";
import {
  Account as PrismaAccount,
  Person as PrismaPerson,
  Prisma,
} from "@prisma/client";

export class PrismaUserMapper {
  static toDomain(raw: PrismaAccount & { person: PrismaPerson }) {
    return User.create(
      {
        first_name: raw.person.first_name,
        last_name: raw.person.last_name,
        email: raw.email,
        password: raw.password,
        cpf: raw.person.cpf,
        phone: raw.cellphone,
        verified_at: raw.verified_at ?? undefined,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UUID(raw.id)
    );
  }

  static toPrisma(user: User) {
    const account: Prisma.AccountUncheckedCreateInput = {
      id: user.id.value,
      email: user.email,
      password: user.password,
      cellphone: user.phone,
      verified_at: user.verified_at,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    const person: Prisma.PersonUncheckedCreateInput = {
      first_name: user.first_name,
      last_name: user.last_name,
      account_id: user.id.value,
      cpf: user.cpf,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return {
      account,
      person,
    };
  }
}
