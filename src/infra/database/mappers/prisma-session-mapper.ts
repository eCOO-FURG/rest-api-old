import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Session } from "@/domain/entities/session";
import { Session as PrismaSession, Prisma } from "@prisma/client";

export class PrismaSessionMapper {
  static toDomain(raw: PrismaSession) {
    return Session.create(
      {
        ip_address: raw.ip_address,
        user_agent: raw.user_agent,
        account_id: new UniqueEntityID(raw.account_id),
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(session: Session): Prisma.SessionUncheckedCreateInput {
    return {
      id: session.id.toString(),
      ip_address: session.ip_address,
      user_agent: session.user_agent,
      account_id: session.account_id.toString(),
      created_at: session.created_at,
      updated_at: session.updated_at,
    };
  }
}
