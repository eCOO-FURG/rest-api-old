import { Cycle } from "@/domain/entities/cycle";

export class CyclePresenter {
  static toHttp(cycle: Cycle) {
    return {
      id: cycle.id.value,
      alias: cycle.alias,
      offering: cycle.offering,
      ordering: cycle.ordering,
      dispatching: cycle.dispatching,
    };
  }
}
