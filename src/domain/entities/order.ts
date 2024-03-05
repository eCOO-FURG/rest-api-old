import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";
import { OrderProduct } from "./order-products";

export interface OrderProps extends Optional<EntityProps, "created_at"> {
  customer_id: UUID;
  shipping_address: string;
  payment_method: "PIX" | "ON_DELIVERY";
  status: "READY" | "PENDING" | "DISPATCHED" | "CANCELED" | "PAID";
  items: OrderProduct[];
  price: number;
}

export class Order extends Entity<OrderProps> {
  get customer_id() {
    return this.props.customer_id;
  }

  get shipping_address() {
    return this.props.shipping_address;
  }

  get payment_method() {
    return this.props.payment_method;
  }

  get items() {
    return this.props.items;
  }

  get status() {
    return this.props.status;
  }

  set status(status: OrderProps["status"]) {
    this.props.status = status;
    this.touch();
  }

  get price() {
    return this.props.price;
  }

  set price(price: number) {
    this.props.price = price;
  }

  add(item: OrderProduct) {
    this.props.items.push(item);
  }

  static create(
    props: Optional<OrderProps, "status" | "items" | "price">,
    id?: UUID
  ) {
    const order = new Order(
      {
        ...props,
        status: props.status ?? "PENDING",
        items: props.items ?? [],
        price: props.price ?? 0,
      },
      id
    );

    return order;
  }
}
