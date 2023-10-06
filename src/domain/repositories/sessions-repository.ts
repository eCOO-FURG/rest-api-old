import { Session } from "../entities/session";

export interface SessionsRepository {
  save(session: Session): Promise<void>;
  findValidSessionByAccountIdAndUserAgent(
    account_id: string,
    user_agent: string
  ): Promise<Session | null>;
}
