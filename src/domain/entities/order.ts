import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { ProductsOrderedEvent } from "../events/on-products-ordered";

interface OrderProps {
  customer_id: UniqueEntityID;
  shipping_address: string;
  payment_method: "PIX";
  status: "CREATED" | "SETTLED" | "CANCELLED";
  created_at: Date;
  updated_at?: Date | null;
}

export class Order extends AggregateRoot<OrderProps> {
  static create(
    props: Optional<OrderProps, "created_at" | "status">,
    id?: UniqueEntityID
  ) {
    const order = new Order(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
        status: props.status ?? "CREATED",
      },
      id
    );

    order.addDomainEvent(new ProductsOrderedEvent(order));

    return order;
  }
}
