import { Optional } from "@/core/types/optional";
import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";

interface Item extends Optional<EntityProps, "created_at"> {
  offer_id: UUID;
  product_id: UUID;
  price: number;
  quantity_or_weight: number;
}

interface OfferProps extends Optional<EntityProps, "created_at"> {
  agribusiness_id: UUID;
  items: Item[];
}

export class Offer extends Entity<OfferProps> {
  get agribusiness_id() {
    return this.props.agribusiness_id;
  }

  get items() {
    return this.props.items;
  }

  add(item: Item) {
    this.props.items.push(item);
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
