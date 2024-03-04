import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";

interface OrderProductProps extends Optional<EntityProps, "created_at"> {
  order_id: UUID;
  offer_id: UUID;
  product_id: UUID;
  quantity_or_weight: number;
}

export class OrderProduct extends Entity<OrderProductProps> {
  get offer_id() {
    return this.props.offer_id;
  }

  get order_id() {
    return this.props.order_id;
  }

  get product_id() {
    return this.props.product_id;
  }

  get quantity_or_weight() {
    return this.props.quantity_or_weight;
  }

  set quantity_or_weight(quantity_or_weight: number) {
    this.props.quantity_or_weight = quantity_or_weight;
  }

  static create(props: OrderProductProps, id?: UUID) {
    const orderProduct = new OrderProduct({ ...props }, id);
    return orderProduct;
  }
}
