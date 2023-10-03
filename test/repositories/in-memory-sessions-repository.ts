import { Session } from "@/domain/entities/session";
import { SessionsRepository } from "@/domain/repositories/sessions-repository";

export class InMemorySessionsRepository implements SessionsRepository {
  public items: Session[] = [];

  async save(session: Session): Promise<void> {
    this.items.push(session);
  }

  async findValidSessionByAccountId(
    account_id: string
  ): Promise<Session | null> {
    const session = this.items.find(
      (item) =>
        item.account_id.toString() === account_id && item.status === "VALID"
    );

    if (!session) return null;

    return session;
  }
}
