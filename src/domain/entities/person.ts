import { Optional } from "@/core/types/optional";
import { Entity } from "../../core/entities/entity";
import { UniqueEntityID } from "../../core/entities/value-objects/unique-entity-id";
import { Cpf } from "./value-objects/cpf";

interface PersonProps {
  account_id: UniqueEntityID;
  first_name: string;
  last_name: string;
  cpf: Cpf;
  created_at: Date;
  updated_at?: Date | null;
}

export class Person extends Entity<PersonProps> {
  get cpf() {
    return this.props.cpf;
  }

  get account_id() {
    return this.props.account_id;
  }

  get first_name() {
    return this.props.first_name;
  }

  get last_name() {
    return this.props.last_name;
  }

  static create(
    props: Optional<PersonProps, "created_at">,
    id?: UniqueEntityID
  ) {
    const person = new Person(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id
    );

    return person;
  }
}
