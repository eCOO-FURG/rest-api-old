import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

interface ChargeProps {
  order_id: UniqueEntityID;
  customer_email: string;
  payment_method: "PIX";
  value: string;
  due_date: Date;
}

export class Charge extends Entity<ChargeProps> {
  get order_id() {
    return this.props.order_id;
  }

  get customer_email() {
    return this.props.customer_email;
  }

  get payment_method() {
    return this.props.payment_method;
  }

  get value() {
    return this.props.value;
  }

  get due_date() {
    return this.props.due_date;
  }

  static create(props: ChargeProps, id?: UniqueEntityID) {
    const charge = new Charge(
      {
        ...props,
      },
      id
    );

    return charge;
  }
}
