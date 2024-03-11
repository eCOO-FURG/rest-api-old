import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";

interface EmailProps extends Optional<EntityProps, "created_at"> {
  to: string;
  from: string;
  subject: string;
  view: string;
}

export class Email extends Entity<EmailProps> {
  get to() {
    return this.props.to;
  }

  get from() {
    return this.props.from;
  }

  get subject() {
    return this.props.subject;
  }

  get html() {
    return this.props.view;
  }

  static create(props: EmailProps, id?: UUID) {
    const email = new Email({ ...props }, id);
    return email;
  }
}
