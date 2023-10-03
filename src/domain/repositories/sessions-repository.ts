import { Session } from "../entities/session";

export interface SessionsRepository {
  save(session: Session): Promise<void>;
  findValidSessionByAccountId(account_id: string): Promise<Session | null>;
}
