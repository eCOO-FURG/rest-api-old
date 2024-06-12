import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";
import { Product } from "./product";
import { ResourceAlreadyExistsError } from "../use-cases/errors/resource-already-exists-error";
import { InvalidWeightError } from "../use-cases/errors/invalid-weight-error";
import { User } from "./user";

interface Item extends Optional<EntityProps, "created_at" | "updated_at"> {
  offer_id: UUID;
  product: Product;
  amount: number;
}

export interface OrderProps
  extends Optional<EntityProps, "created_at" | "updated_at"> {
  cycle_id: UUID;
  customer: User;
  shipping_address: string | null;
  price: number;
  payment_method: "ON_DELIVERY";
  status: "READY" | "PENDING" | "DISPATCHED" | "CANCELED" | "PAID";
  items: Item[];
}

export class Order extends Entity<OrderProps> {
  get customer() {
    return this.props.customer;
  }

  get cycle_id() {
    return this.props.cycle_id;
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
    const found = this.props.items.find((e) => e.product.equals(item.product));

    if (found) {
      throw new ResourceAlreadyExistsError("Pedido de", found.product.name);
    }

    if (item.product.pricing === "WEIGHT" && item.amount % 50 !== 0) {
      throw new InvalidWeightError("solicitado", item.product.name);
    }

    this.items.push(item);
  }

  static create(
    props: Optional<
      OrderProps,
      "status" | "price" | "items" | "shipping_address"
    >,
    id?: UUID
  ) {
    const order = new Order(
      {
        ...props,
        shipping_address: props.shipping_address ?? null,
        status: props.status ?? "PENDING",
        items: props.items ?? [],
        price: props.price ?? 0,
      },
      id
    );

    return order;
  }
}
