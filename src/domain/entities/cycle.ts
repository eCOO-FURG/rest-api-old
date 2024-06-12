import { Entity, EntityProps } from "../../core/entities/entity";
import { UUID } from "../../core/entities/uuid";
import { Optional } from "../../core/types/optional";

interface CycleProps
  extends Optional<EntityProps, "created_at" | "updated_at"> {
  alias: string;
  offering: number[];
  ordering: number[];
  dispatching: number[];
  duration: number;
}

export class Cycle extends Entity<CycleProps> {
  get alias() {
    return this.props.alias;
  }

  get offering() {
    return this.props.offering;
  }

  get ordering() {
    return this.props.ordering;
  }

  get dispatching() {
    return this.props.dispatching;
  }

  get duration() {
    return this.props.duration;
  }

  static create(props: CycleProps, id?: UUID) {
    const cycle = new Cycle(props, id);
    return cycle;
  }
}
