import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface AgribusinessProps {
  name: string;
  caf: string;
  account_id: UniqueEntityID;
  created_at: Date;
  updated_at?: Date | null;
}

export class Agribusiness extends AggregateRoot<AgribusinessProps> {
  get caf() {
    return this.props.caf;
  }

  static create(
    props: Optional<AgribusinessProps, "created_at">,
    id?: UniqueEntityID
  ) {
    const agribusiness = new Agribusiness(
      {
        ...props,
        created_at: props.created_at ?? new Date(),
      },
      id
    );

    return agribusiness;
  }
}
