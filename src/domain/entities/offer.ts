import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface OfferProps {
  agribusiness_id: UniqueEntityID;
  status: "SETTLED" | "DECLINED" | "PENDING";
  created_at: Date;
  updated_at?: Date | null;
}

export class Offer extends AggregateRoot<OfferProps> {
  get status() {
    return this.props.status;
  }

  private touch() {
    this.props.updated_at = new Date();
  }

  static create(
    props: Optional<OfferProps, "created_at" | "status">,
    id?: UniqueEntityID
  ) {
    const offer = new Offer(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
        status: props.status ?? "PENDING",
      },
      id
    );
    return offer;
  }
}
