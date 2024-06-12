import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";

export interface AgribusinessProps
  extends Optional<EntityProps, "created_at" | "updated_at"> {
  name: string;
  caf: string;
  active: boolean;
  admin_id: UUID;
}

export class Agribusiness extends Entity<AgribusinessProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get caf() {
    return this.props.caf;
  }

  set caf(caf: string) {
    this.props.caf = caf;
  }

  get active() {
    return this.props.active;
  }

  set active(active: boolean) {
    this.props.active = active;
  }

  get admin_id() {
    return this.props.admin_id;
  }

  touch() {
    this.props.updated_at = new Date();
  }

  static create(props: Optional<AgribusinessProps, "active">, id?: UUID) {
    const agribusiness = new Agribusiness(
      {
        ...props,
        active: props.active ?? true,
      },
      id
    );

    return agribusiness;
  }
}
