import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface OfferProductProps {
  offer_id: UniqueEntityID;
  product_id: UniqueEntityID;
  amount: string;
  quantity: string;
  weight: string;
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

  get amount() {
    return this.props.amount;
  }

  get quantity() {
    return this.props.quantity;
  }

  get weight() {
    return this.props.weight;
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
