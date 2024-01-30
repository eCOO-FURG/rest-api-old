import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Cpf } from "./value-objects/cpf";

interface CustomerProps {
  fullName: string;
  cpf: Cpf;
}

export class Customer extends Entity<CustomerProps> {
  get full_name() {
    return this.props.fullName;
  }

  get cpf() {
    return this.props.cpf;
  }

  static create(props: CustomerProps, id?: UniqueEntityID) {
    const customer = new Customer(
      {
        ...props,
      },
      id
    );

    return customer;
  }
}
