import { Account } from "@/domain/entities/account";
import { Person } from "@/domain/entities/person";

export class UserPresenter {
  static toHttp(account: Account, person: Person) {
    return {
      person: {
        id: person.id.toString(),
        first_name: person.first_name,
        last_name: person.last_name,
        account: {
          id: account.id.toString(),
          email: account.email,
        },
      },
    };
  }
}
