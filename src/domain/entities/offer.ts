import { Optional } from "@/core/types/optional";
import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";

interface Item extends Optional<EntityProps, "created_at"> {
  id: UUID;
  offer_id: UUID;
  product_id: UUID;
  price: number;
  quantity_or_weight: number;
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

  add(item: Item) {
    const found = this.props.items.findIndex((unit) =>
      unit.product_id.equals(item.product_id)
    );

    if (found < 0) {
      this.props.items.push(item);
      return;
    }

    this.props.items[found] = item;
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
