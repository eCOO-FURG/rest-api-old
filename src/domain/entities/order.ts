import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";
import { s } from "vitest/dist/types-198fd1d9";

interface OrderProps {
  customer_id: UniqueEntityID;
  shipping_address: string;
  payment_method: "PIX";
  status: "READY" | "ON_HOLD" | "PENDING" | "DISPATCHED" | "CANCELED";
  created_at: Date;
  updated_at?: Date | null;
}

export class Order extends AggregateRoot<OrderProps> {
  get customer_id() {
    return this.props.customer_id;
  }

  get shipping_address() {
    return this.props.shipping_address;
  }

  get payment_method() {
    return this.props.payment_method;
  }

  get status() {
    return this.props.status;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  set status(status: OrderProps["status"]) {
    this.props.status = status;
    this.touch();
  }

  private touch() {
    this.props.updated_at = new Date();
  }

  static create(
    props: Optional<OrderProps, "created_at" | "status">,
    id?: UniqueEntityID
  ) {
    const order = new Order(
      {
        ...props,
        status: props.status ?? "PENDING",
        created_at: props.created_at ?? new Date(),
      },
      id
    );

    return order;
  }
}
