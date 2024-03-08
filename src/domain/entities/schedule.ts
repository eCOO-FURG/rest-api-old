import { Entity, EntityProps } from "@/core/entities/entity";
import { UUID } from "@/core/entities/uuid";
import { Optional } from "@/core/types/optional";
import { Cycle } from "./cycle";

interface ScheduleProps extends Optional<EntityProps, "created_at"> {
  start_at: Date;
  cycle: Cycle;
}

export class Schedule extends Entity<ScheduleProps> {
  get start_at() {
    return this.props.start_at;
  }

  get cycle() {
    return this.props.cycle;
  }

  static create(props: ScheduleProps, id?: UUID) {
    const schedule = new Schedule(props, id);
    return schedule;
  }
}
