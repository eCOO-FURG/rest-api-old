import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { OneTimePasswordRegisteredEvent } from "../events/on-one-time-password-registered";

interface OneTimePasswordProps {
  account_id: UniqueEntityID;
  value: string;
  used: boolean;
  created_at: Date;
  updated_at?: Date | null;
}

export class OneTimePassword extends AggregateRoot<OneTimePasswordProps> {
  get account_id() {
    return this.props.account_id;
  }

  get value() {
    return this.props.value;
  }

  get used() {
    return this.props.used;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  expire() {
    this.props.used = true;
    this.touch();
  }

  private touch() {
    this.props.updated_at = new Date();
  }

  static create(
    props: Optional<OneTimePasswordProps, "used" | "created_at">,
    id?: UniqueEntityID
  ) {
    const oneTimePassword = new OneTimePassword(
      {
        ...props,
        used: props.used ?? false,
        created_at: props.created_at ?? new Date(),
      },
      id
    );

    oneTimePassword.addDomainEvent(
      new OneTimePasswordRegisteredEvent(oneTimePassword)
    );

    return oneTimePassword;
  }
}
