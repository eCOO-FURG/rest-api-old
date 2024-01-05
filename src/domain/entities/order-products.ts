import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface OrderProductProps {
  order_id: UniqueEntityID;
  product_id: UniqueEntityID;
  quantity: number;
  created_at: Date;
  updated_at?: Date | null;
}

export class OrderProduct extends Entity<OrderProductProps> {
  get order_id() {
    return this.props.order_id;
  }

  get product_id() {
    return this.props.product_id;
  }

  get quantity() {
    return this.props.quantity;
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
