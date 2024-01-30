import { Account } from "../entities/account";
import { Cellphone } from "../entities/value-objects/cellphone";

export interface AccountsRepository {
  findById(id: string): Promise<Account | null>;
  findByEmail(email: string): Promise<Account | null>;
  findByCellphone(cellphone: Cellphone): Promise<Account | null>;
  save(account: Account): Promise<void>;
  update(account: Account): Promise<void>;
}
