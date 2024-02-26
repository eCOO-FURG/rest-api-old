import { OneTimePassword } from "../entities/one-time-password";

export interface OneTimePasswordsRepository {
  save(oneTimePassword: OneTimePassword): Promise<void>;
  expirePreviousOneTimePassword(account_id: string): Promise<void>;
}
