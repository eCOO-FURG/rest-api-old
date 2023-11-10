import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface SessionProps {
  account_id: UniqueEntityID;
  ip_address: string;
  user_agent: string;
  created_at: Date;
  updated_at?: Date | null;
}

export class Session extends Entity<SessionProps> {
  get account_id() {
    return this.props.account_id;
  }

  get ip_address() {
    return this.props.ip_address;
  }

  get user_agent() {
    return this.props.user_agent;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  static create(
    props: Optional<SessionProps, "created_at">,
    id?: UniqueEntityID
  ) {
    const session = new Session(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id
    );

    return session;
  }
}
