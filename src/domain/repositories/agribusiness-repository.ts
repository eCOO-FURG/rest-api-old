import { Agribusiness } from "../entities/agribusiness";

export interface AgribusinessRepository {
  findByCaf(caf: string): Promise<Agribusiness | null>;
  save(agribusiness: Agribusiness): Promise<void>;
}
