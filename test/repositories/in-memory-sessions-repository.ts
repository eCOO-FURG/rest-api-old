import { Session } from "@/domain/entities/session";
import { SessionsRepository } from "@/domain/repositories/sessions-repository";
import { env } from "@/infra/env";

export class InMemorySessionsRepository implements SessionsRepository {
  public items: Session[] = [];

  async save(session: Session): Promise<void> {
    this.items.push(session);
  }

  async findValidSessionByAccountIdAndUserAgent(
    account_id: string,
    user_agent: string
  ): Promise<Session | null> {
    const sessionExpiration = new Date(
      Date.now() - env.SESSION_DURATION_IN_DAYS * 24 * 60 * 60 * 1000
    );

    const session = this.items.find(
      (item) =>
        item.account_id.toString() === account_id &&
        item.user_agent === user_agent &&
        item.created_at > sessionExpiration
    );

    if (!session) return null;

    return session;
  }
}
