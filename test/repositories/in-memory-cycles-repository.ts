import { Cycle } from "@/domain/entities/cycle";
import { CyclesRepository } from "@/domain/repositories/cycles-repository";

export class InMemoryCyclesRepository implements CyclesRepository {
  items: Cycle[] = [];

  async save(cycle: Cycle): Promise<void> {
    this.items.push(cycle);
  }

  async findByAlias(alias: string): Promise<Cycle | null> {
    const cycle = this.items.find((cycle) => cycle.alias === alias);

    if (!cycle) {
      return null;
    }

    return cycle;
  }

  async findById(id: string): Promise<Cycle | null> {
    const cycle = this.items.find((cycle) => cycle.id.equals(id));

    if (!cycle) {
      return null;
    }

    return cycle;
  }
}
