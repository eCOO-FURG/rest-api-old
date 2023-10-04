import { Session } from "../entities/session";

export interface SessionsRepository {
  save(session: Session): Promise<void>;
  findValidSessionByAccountIdAndIpAddress(
    account_id: string,
    ip_address: string
  ): Promise<Session | null>;
}
