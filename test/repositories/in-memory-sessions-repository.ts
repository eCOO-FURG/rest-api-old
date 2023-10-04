import { Session } from "@/domain/entities/session";
import { SessionsRepository } from "@/domain/repositories/sessions-repository";

export class InMemorySessionsRepository implements SessionsRepository {
  public items: Session[] = [];

  async save(session: Session): Promise<void> {
    this.items.push(session);
  }

  async findValidSessionByAccountIdAndIpAddress(
    account_id: string,
    ip_address: string
  ): Promise<Session | null> {
    const session = this.items.find(
      (item) =>
        item.account_id.toString() === account_id &&
        item.status === "VALID" &&
        item.ip_address === ip_address
    );

    if (!session) return null;

    return session;
  }
}
