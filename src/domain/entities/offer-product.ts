import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface OfferProductProps {
  offer_id: UniqueEntityID;
  product_id: UniqueEntityID;
  amount: string;
  quantity: string;
  weight: string;
  status: "APPROVED" | "DECLINED" | "PENDING";
  created_at: Date;
  updated_at?: Date | null;
}

export class OfferProduct extends Entity<OfferProductProps> {
  get status() {
    return this.props.status;
  }

  get weight() {
    return this.props.weight;
  }

  get quantity() {
    return this.props.quantity;
  }

  get amount() {
    return this.props.amount;
  }

  get product_id() {
    return this.props.product_id;
  }

  get offer_id() {
    return this.props.offer_id;
  }

  static create(
    props: Optional<OfferProductProps, "created_at" | "status">,
    id?: UniqueEntityID
  ) {
    const offerProduct = new OfferProduct(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
        status: props.status ?? "PENDING",
      },
      id
    );

    return offerProduct;
  }
}
