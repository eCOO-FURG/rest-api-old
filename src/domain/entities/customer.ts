import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

interface CustomerProps {
  full_name: string;
  cpf: string;
}

export class Customer extends Entity<CustomerProps> {
  get full_name() {
    return this.props.full_name;
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
