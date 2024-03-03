import { Optional } from "@/core/types/optional";
import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { OfferProduct } from "./offer-product";

interface OfferProps extends Optional<EntityProps, "created_at"> {
  agribusiness_id: UUID;
  items: OfferProduct[];
}

export class Offer extends Entity<OfferProps> {
  get agribusiness_id() {
    return this.props.agribusiness_id;
  }

  get items() {
    return this.props.items;
  }

  add(item: OfferProduct) {
    this.props.items.push(item);
  }

  static create(props: Optional<OfferProps, "items">, id?: UUID) {
    const offer = new Offer(
      {
        ...props,
        items: props.items ?? [],
        created_at: props.created_at ?? new Date(),
      },
      id
    );
    return offer;
  }
}
