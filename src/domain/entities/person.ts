import { Entity } from "../../core/entities/entity";
import { UniqueEntityID } from "../../core/entities/value-objects/unique-entity-id";
import { Cpf } from "./value-objects/cpf";

interface PersonProps {
  account_id: UniqueEntityID;
  first_name: string;
  last_name: string;
  cpf: Cpf;
}

export class Person extends Entity<PersonProps> {
  get cpf() {
    return this.props.cpf;
  }

  static create(props: PersonProps, id?: UniqueEntityID) {
    const person = new Person(props, id);

    return person;
  }
}
