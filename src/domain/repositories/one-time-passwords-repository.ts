import { OneTimePassword } from "../entities/one-time-password";

export interface OneTimePasswordsRepository {
  save(oneTimePassword: OneTimePassword): Promise<void>;
  update(oneTimePassword: OneTimePassword): Promise<void>;
  expirePreviousForAccountId(account_id: string): Promise<void>;
  findValidByAccountId(account_id: string): Promise<OneTimePassword | null>;
}
