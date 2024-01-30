import { Agribusiness } from "../entities/agribusiness";

export interface AgribusinessesRepository {
  findById(id: string): Promise<Agribusiness | null>;
  save(agribusiness: Agribusiness): Promise<void>;
}
