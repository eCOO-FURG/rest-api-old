import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface EmailProps {
  to: string;
  from: string;
  subject: string;
  html: string;
  created_at: Date;
  updated_at?: Date | null;
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
    return this.props.html;
  }

  static create(
    props: Optional<EmailProps, "created_at">,
    id?: UniqueEntityID
  ) {
    const email = new Email(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id
    );

    return email;
  }
}
