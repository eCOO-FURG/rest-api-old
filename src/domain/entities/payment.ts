import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

interface PaymentProps {
  charge_id: UniqueEntityID;
  key: string;
  qrcode: string;
  value: string;
  expiration_date: Date;
}

export class Payment extends Entity<PaymentProps> {
  get charge_id() {
    return this.props.charge_id;
  }

  get key() {
    return this.props.key;
  }

  get qrcode() {
    return this.props.qrcode;
  }

  get value() {
    return this.props.value;
  }

  get expiration_date() {
    return this.props.expiration_date;
  }

  static create(props: PaymentProps, id?: UniqueEntityID) {
    const payment = new Payment(
      {
        ...props,
      },
      id
    );

    return payment;
  }
}
