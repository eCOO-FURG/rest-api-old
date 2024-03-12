import { Cycle } from "@/domain/entities/cycle";

export class CyclesPresenter {
  static toHttp(cycles: Cycle[]) {
    const mappedCycles = cycles.map((item) => ({
      id: item.id.value,
      alias: item.alias,
      offering: item.offering,
      ordering: item.ordering,
      dispatching: item.dispatching,
    }));

    return mappedCycles;
  }
}
