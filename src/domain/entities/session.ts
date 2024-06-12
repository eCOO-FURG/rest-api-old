import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";

interface SessionProps
  extends Optional<EntityProps, "created_at" | "updated_at"> {
  user_id: UUID;
  ip_address: string;
  user_agent: string;
}

export class Session extends Entity<SessionProps> {
  get user_id() {
    return this.props.user_id;
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

  static create(props: SessionProps, id?: UUID) {
    const session = new Session({ ...props }, id);
    return session;
  }
}
