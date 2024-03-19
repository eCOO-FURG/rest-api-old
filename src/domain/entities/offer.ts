import { Optional } from "@/core/types/optional";
import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Product } from "./product";

interface Item extends Optional<EntityProps, "created_at"> {
  offer_id: UUID;
  product: Product;
  price: number;
  amount: number;
}

interface OfferProps extends Optional<EntityProps, "created_at"> {
  agribusiness_id: UUID;
  cycle_id: UUID;
  items: Item[];
}

export class Offer extends Entity<OfferProps> {
  get agribusiness_id() {
    return this.props.agribusiness_id;
  }

  get cycle_id() {
    return this.props.cycle_id;
  }

  get items() {
    return this.props.items;
  }

  add(item: Optional<Item, "offer_id">) {
    const found = this.props.items.findIndex((e) =>
      e.product.id.equals(item.product.id)
    );

    if (found < 0) {
      this.items.push({
        offer_id: this.id,
        ...item,
      });
    }

    // throw exeception
  }

  static create(props: Optional<OfferProps, "items">, id?: UUID) {
    const offer = new Offer(
      {
        ...props,
        items: props.items ?? [],
      },
      id
    );
    return offer;
  }
}
