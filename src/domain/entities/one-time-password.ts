import { Optional } from "@/core/types/optional";
import { OneTimePasswordRegisteredEvent } from "../events/on-one-time-password-registered";
import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";

interface OneTimePasswordProps extends Optional<EntityProps, "created_at"> {
  user_id: UUID;
  value: string;
  used: boolean;
}

export class OneTimePassword extends Entity<OneTimePasswordProps> {
  get user_id() {
    return this.props.user_id;
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

  static create(
    props: Optional<OneTimePasswordProps, "used" | "created_at">,
    id?: UUID
  ) {
    const oneTimePassword = new OneTimePassword(
      {
        ...props,
        used: props.used ?? false,
      },
      id
    );

    return oneTimePassword;
  }
}
