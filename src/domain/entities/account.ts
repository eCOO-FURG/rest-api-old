import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

interface AccountProps {
  email: string;
  password: string;
}

export class Account extends Entity<AccountProps> {
  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  static create(props: AccountProps, id?: UniqueEntityID) {
    const account = new Account(props, id);

    return account;
  }
}
