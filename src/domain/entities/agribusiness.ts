import { AggregateRoot } from "@/core/entities/aggregate-root";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Optional } from "@/core/types/optional";

export interface AgribusinessProps {
  name: string;
  caf: string;
  active: boolean;
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
        active: props.active ?? true,
        created_at: props.created_at ?? new Date(),
      },
      id
    );

    return agribusiness;
  }

  static update(
    agribusiness: Agribusiness,
    updates: Partial<AgribusinessProps>
  ) {
    const updatedAgribusiness = new Agribusiness(
      {
        ...agribusiness.props,
        ...updates,
        updated_at: new Date(),
      },
      agribusiness.id
    );

    return updatedAgribusiness;
  }
}
