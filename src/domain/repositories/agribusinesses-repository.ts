import { Agribusiness } from "../entities/agribusiness";

export interface AgribusinessesRepository {
  findById(id: string): Promise<Agribusiness | null>;
  findByCaf(caf: string): Promise<Agribusiness | null>;
  findByAdminId(admin_id: string): Promise<Agribusiness | null>;
  findAllSortedByName(page: number, pageSize: number): Promise<Agribusiness[]>;
  save(agribusiness: Agribusiness): Promise<void>;
  update(agribusiness: Agribusiness): Promise<void>;
}
