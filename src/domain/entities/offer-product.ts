import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";

interface OfferProductProps extends Optional<EntityProps, "created_at"> {
  offer_id: UUID;
  product_id: UUID;
  price: number;
  quantity_or_weight: number;
}

export class OfferProduct extends Entity<OfferProductProps> {
  get offer_id() {
    return this.props.offer_id;
  }

  get product_id() {
    return this.props.product_id;
  }

  get price() {
    return this.props.price;
  }

  get quantity_or_weight() {
    return this.props.quantity_or_weight;
  }

  set quantity_or_weight(quantity_or_weight: number) {
    this.props.quantity_or_weight = quantity_or_weight;
  }

  static create(props: OfferProductProps, id?: UUID) {
    const offerProduct = new OfferProduct({ ...props }, id);
    return offerProduct;
  }
}
