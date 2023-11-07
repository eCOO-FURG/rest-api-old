import { Agribusiness } from "../entities/agribusiness";

export interface AgribusinessesRepository {
  findByCaf(caf: string): Promise<Agribusiness | null>;
  findById(id: string): Promise<Agribusiness | null>;
  findByAdminId(admin_id: string): Promise<Agribusiness | null>;
  save(agribusiness: Agribusiness): Promise<void>;
}
