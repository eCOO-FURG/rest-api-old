import { Agribusiness } from "@/domain/entities/agribusiness";
import { AgribusinessesRepository } from "@/domain/repositories/agribusinesses-repository";

export class InMemoryAgribusinessesRepository
  implements AgribusinessesRepository
{
  items: Agribusiness[] = [];

  async findById(id: string): Promise<Agribusiness | null> {
    const agribusiness = this.items.find((item) => item.id.toString() === id);

    if (!agribusiness) return null;

    return agribusiness;
  }

  async findByCaf(caf: string): Promise<Agribusiness | null> {
    const agribusiness = this.items.find((item) => item.caf === caf);

    if (!agribusiness) return null;

    return agribusiness;
  }

  async save(agribusiness: Agribusiness): Promise<void> {
    this.items.push(agribusiness);
  }
}
