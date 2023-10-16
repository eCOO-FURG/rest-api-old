import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { UserRegisteredEvent } from "../events/on-user-registered";
import { Optional } from "@/core/types/optional";

interface AccountProps {
  email: string;
  password: string;
  verified_at?: Date | null;
  created_at: Date;
  updated_at?: Date | null;
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

  private touch() {
    this.props.updated_at = new Date();
  }

  verify() {
    this.props.verified_at = new Date();
    this.touch();
  }

  static create(
    props: Optional<AccountProps, "created_at">,
    id?: UniqueEntityID
  ) {
    const account = new Account(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id
    );

    const isNewAccount = !id;

    if (isNewAccount) {
      account.addDomainEvent(new UserRegisteredEvent(account));
    }

    return account;
  }
}
