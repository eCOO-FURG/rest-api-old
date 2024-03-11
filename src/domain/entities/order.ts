import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";

interface Item extends Optional<EntityProps, "created_at"> {
  id: UUID;
  order_id: UUID;
  offer_id: UUID;
  product_id: UUID;
  quantity_or_weight: number;
}

export interface OrderProps extends Optional<EntityProps, "created_at"> {
  customer_id: UUID;
  shipping_address: string;
  price: number;
  payment_method: "PIX" | "ON_DELIVERY";
  status: "READY" | "PENDING" | "DISPATCHED" | "CANCELED" | "PAID";
  items: Item[];
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

  tax(percentage: number) {
    this.props.price = (this.props.price / 100) * (100 + percentage);
  }

  add(item: Item) {
    this.props.items.push(item);
  }

  static create(
    props: Optional<OrderProps, "status" | "price" | "items">,
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
