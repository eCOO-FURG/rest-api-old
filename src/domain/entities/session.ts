import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface SessionProps {
  account_id: UniqueEntityID;
  ip_address: string;
  status: "VALID" | "EXPIRED";
  created_at: Date;
}

export class Session extends Entity<SessionProps> {
  get account_id() {
    return this.props.account_id;
  }

  get ip_address() {
    return this.props.ip_address;
  }

  get status() {
    return this.props.status;
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
