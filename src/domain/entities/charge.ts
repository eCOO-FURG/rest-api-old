import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";

export interface ChargeProps extends Optional<EntityProps, "created_at"> {
  order_id: UUID;
  value: number;
}

export class Charge<Props> extends Entity<ChargeProps & Props> {
  get order_id() {
    return this.props.order_id;
  }

  get value() {
    return this.props.value;
  }

  set value(value: number) {
    this.props.value = value;
  }

  static create(props: Optional<ChargeProps, "value">, id?: UUID) {
    const charge = new Charge({ ...props, value: props.value ?? 0 }, id);
    return charge;
  }
}
