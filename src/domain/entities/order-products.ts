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
