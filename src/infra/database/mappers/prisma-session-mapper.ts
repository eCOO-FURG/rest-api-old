import { UUID } from "@/core/entities/uuid";
import { Session } from "@/domain/entities/session";
import { Session as PrismaSession, Prisma } from "@prisma/client";

export class PrismaSessionMapper {
  static toDomain(raw: PrismaSession) {
    return Session.create(
      {
        ip_address: raw.ip_address,
        user_agent: raw.user_agent,
        user_id: new UUID(raw.account_id),
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UUID(raw.id)
    );
  }

  static toPrisma(session: Session): Prisma.SessionUncheckedCreateInput {
    return {
      id: session.id.toString(),
      ip_address: session.ip_address,
      user_agent: session.user_agent,
      account_id: session.user_id.value,
      created_at: session.created_at,
      updated_at: session.updated_at,
    };
  }
}
