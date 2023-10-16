import { Session } from "@/domain/entities/session";
import { SessionsRepository } from "@/domain/repositories/sessions-repository";
import { PrismaSessionMapper } from "../mappers/prisma-session-mapper";
import { prisma } from "../prisma-service";
import { env } from "@/infra/env";

export class PrismaSessionsRepository implements SessionsRepository {
  async save(session: Session): Promise<void> {
    const data = PrismaSessionMapper.toPrisma(session);

    await prisma.session.create({
      data,
    });
  }

  async findValidSessionByAccountIdAndUserAgent(
    account_id: string,
    user_agent: string
  ): Promise<Session | null> {
    const sessionExpiration = new Date(
      Date.now() - env.SESSION_DURATION_IN_DAYS * 24 * 60 * 60 * 1000
    );

    const session = await prisma.session.findFirst({
      where: {
        account_id,
        user_agent,
        created_at: {
          gte: sessionExpiration, // greater than or equal
        },
      },
    });

    if (!session) {
      return null;
    }

    return PrismaSessionMapper.toDomain(session);
  }
}
