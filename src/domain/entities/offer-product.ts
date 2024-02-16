import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface OfferProductProps {
  offer_id: UniqueEntityID;
  product_id: UniqueEntityID;
  price: number;
  quantity_or_weight: number;
  created_at: Date;
  updated_at?: Date | null;
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

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
  }

  static create(
    props: Optional<OfferProductProps, "created_at">,
    id?: UniqueEntityID
  ) {
    const offerProduct = new OfferProduct(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id
    );

    return offerProduct;
  }
}
