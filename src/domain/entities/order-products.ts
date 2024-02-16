import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface OrderProductProps {
  order_id: UniqueEntityID;
  offer_product_id: UniqueEntityID;
  product_id: UniqueEntityID;
  quantity_or_weight: number;
  created_at: Date;
  updated_at?: Date | null;
}

export class OrderProduct extends Entity<OrderProductProps> {
  get offer_product_id() {
    return this.props.offer_product_id;
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

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  static create(
    props: Optional<OrderProductProps, "created_at">,
    id?: UniqueEntityID
  ) {
    const orderProduct = new OrderProduct(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id
    );
    return orderProduct;
  }
}
