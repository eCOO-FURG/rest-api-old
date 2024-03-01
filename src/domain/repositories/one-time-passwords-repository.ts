import { OneTimePassword } from "../entities/one-time-password";

export interface OneTimePasswordsRepository {
  save(oneTimePassword: OneTimePassword): Promise<void>;
  update(oneTimePassword: OneTimePassword): Promise<void>;
  findValidByUserId(user_id: string): Promise<OneTimePassword | null>;
  expirePreviousForUserId(user_id: string): Promise<void>;
}
