import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface OfferProps {
  agribusiness_id: UniqueEntityID;
  created_at: Date;
  updated_at?: Date | null;
}

export class Offer extends AggregateRoot<OfferProps> {
  get agribusiness_id() {
    return this.props.agribusiness_id;
  }

  static create(
    props: Optional<OfferProps, "created_at">,
    id?: UniqueEntityID
  ) {
    const offer = new Offer(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id
    );
    return offer;
  }
}
