import { Account } from "@/domain/entities/account";
import { AccountsRepository } from "@/domain/repositories/accounts-repository";

export class InMemoryAccountsRepository implements AccountsRepository {
  public items: Account[] = [];

  async findByEmail(email: string): Promise<Account | null> {
    const account = this.items.find((item) => item.email === email);

    if (!account) return null;

    return account;
  }

  async save(account: Account): Promise<void> {
    this.items.push(account);
  }
}
