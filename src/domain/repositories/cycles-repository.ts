import { Cycle } from "../entities/cycle";

export interface CyclesRepository {
  save(cycle: Cycle): Promise<void>;
  findByAlias(alias: string): Promise<Cycle | null>;
  findById(id: string): Promise<Cycle | null>;
}
