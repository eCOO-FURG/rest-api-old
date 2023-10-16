import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { UserRegisteredEvent } from "../events/on-user-registered";

interface AccountProps {
  email: string;
  password: string;
  verified_at?: Date | null;
}

export class Account extends AggregateRoot<AccountProps> {
  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get verified_at() {
    return this.props.verified_at;
  }

  verify() {
    this.props.verified_at = new Date();
  }

  static create(props: AccountProps, id?: UniqueEntityID) {
    const account = new Account(props, id);

    const isNewAccount = !id;

    if (isNewAccount) {
      account.addDomainEvent(new UserRegisteredEvent(account));
    }

    return account;
  }
}
