import { Session } from "../entities/session";

export interface SessionsRepository {
  save(session: Session): Promise<void>;
  findValidSession(
    user_id: string,
    user_agent: string,
    ip_address: string
  ): Promise<Session | null>;
}
