import { Account } from "../entities/account";

export interface AccountsRepository {
  findById(id: string): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
  save(account: Account): Promise<void>;
}
