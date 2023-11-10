import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface EmailProps {
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

  static create(props: EmailProps, id?: UniqueEntityID) {
    const email = new Email(
      {
        ...props,
      },
      id
    );

    return email;
  }
}
