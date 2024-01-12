import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";

interface PaymentProps {
  key: string;
  qrcode: string;
  value: string;
  expirationDate: Date;
}

export class Payment extends Entity<PaymentProps> {
  get key() {
    return this.props.key;
  }

  get qrcode() {
    return this.props.qrcode;
  }

  get value() {
    return this.props.value;
  }

  get expirationDate() {
    return this.props.expirationDate;
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
