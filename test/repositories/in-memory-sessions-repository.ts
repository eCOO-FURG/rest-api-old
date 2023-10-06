import { Session } from "@/domain/entities/session";
import { SessionsRepository } from "@/domain/repositories/sessions-repository";

export class InMemorySessionsRepository implements SessionsRepository {
  public items: Session[] = [];

  async save(session: Session): Promise<void> {
    this.items.push(session);
  }

  async findValidSessionByAccountIdAndUserAgent(
    account_id: string,
    user_agent: string
  ): Promise<Session | null> {
    const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);

    const session = this.items.find(
      (item) =>
        item.account_id.toString() === account_id &&
        item.user_agent === user_agent &&
        item.created_at > tenDaysAgo
    );

    if (!session) return null;

    return session;
  }
}
