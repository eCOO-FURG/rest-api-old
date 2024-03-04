import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";

interface PaymentProps extends Optional<EntityProps, "created_at"> {
  charge_id?: UUID;
  key?: string;
  qrcode?: string;
  value: string;
  expiration_date?: Date;
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

  set value(value: string) {
    this.value = value;
  }

  get expiration_date() {
    return this.props.expiration_date;
  }

  static create(props: PaymentProps, id?: UUID) {
    const payment = new Payment({ ...props }, id);
    return payment;
  }
}
