import { Session } from "@/domain/entities/session";
import { SessionsRepository } from "@/domain/repositories/sessions-repository";
import { env } from "@/infra/env";

export class InMemorySessionsRepository implements SessionsRepository {
  public items: Session[] = [];

  async save(session: Session): Promise<void> {
    this.items.push(session);
  }

  async findValidSession(
    user_id: string,
    user_agent: string,
    ip_address: string
  ): Promise<Session | null> {
    const expirationDate = new Date(
      Date.now() - env.SESSION_DURATION_IN_DAYS * 24 * 60 * 60 * 1000
    );

    const session = this.items.find(
      (item) =>
        item.user_id.equals(user_id) &&
        item.user_agent === user_agent &&
        item.created_at > expirationDate &&
        item.ip_address === ip_address
    );

    if (!session) return null;

    return session;
  }
}
