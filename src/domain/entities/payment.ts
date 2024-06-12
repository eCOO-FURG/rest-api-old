import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";

interface PaymentProps
  extends Optional<EntityProps, "created_at" | "updated_at"> {
  charge_id?: UUID;
}

export class Payment extends Entity<PaymentProps> {
  get charge_id() {
    return this.props.charge_id;
  }

  static create(props: PaymentProps, id?: UUID) {
    const payment = new Payment({ ...props }, id);
    return payment;
  }
}
