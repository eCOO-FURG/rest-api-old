import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface OfferProps {
  agribusiness_id: UniqueEntityID;
  status: "READY" | "ON_HOLD";
  created_at: Date;
  updated_at?: Date | null;
}

export class Offer extends AggregateRoot<OfferProps> {
  get agribusiness_id() {
    return this.props.agribusiness_id;
  }

  get status() {
    return this.props.status;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
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
