import { Account } from "@/domain/entities/account";
import { AccountsRepository } from "@/domain/repositories/accounts-repository";

export class InMemoryAccountsRepository implements AccountsRepository {
  public items: Account[] = [];

  async findById(id: string): Promise<Account | null> {
    const account = this.items.find((item) => item.id.toString() === id);

    if (!account) return null;

    return account;
  }

  async findByEmail(email: string): Promise<Account | null> {
    const account = this.items.find((item) => item.email === email);

    if (!account) return null;

    return account;
  }

  async save(account: Account): Promise<void> {
    this.items.push(account);
  }

  async update(account: Account): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === account.id);

    this.items[itemIndex] = account;
  }
}
