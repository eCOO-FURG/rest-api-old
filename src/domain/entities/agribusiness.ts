import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

interface AgribusinessProps {
  name: string;
  caf: string;
  admin_id: UniqueEntityID;
  created_at: Date;
  updated_at?: Date | null;
}

export class Agribusiness extends AggregateRoot<AgribusinessProps> {
  get name() {
    return this.props.name;
  }

  get caf() {
    return this.props.caf;
  }

  get admin_id() {
    return this.props.admin_id;
  }

  get created_at() {
    return this.props.created_at;
  }

  get updated_at() {
    return this.props.updated_at;
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
