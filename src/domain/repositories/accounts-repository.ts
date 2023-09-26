import { Account } from "../entities/account";

export interface AccountsRepository {
  findByEmail(email: string): Promise<Account | null>;
  save(account: Account): Promise<void>;
}
