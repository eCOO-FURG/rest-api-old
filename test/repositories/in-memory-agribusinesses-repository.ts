import { Agribusiness } from "@/domain/entities/agribusiness";
import { AgribusinessRepository } from "@/domain/repositories/agribusiness-repository";

export class InMemoryAgribusinessesRepository
  implements AgribusinessRepository
{
  items: Agribusiness[] = [];

  async findByCaf(caf: string): Promise<Agribusiness | null> {
    const agribusiness = this.items.find((item) => item.caf === item.caf);

    if (!agribusiness) return null;

    return agribusiness;
  }

  async save(agribusiness: Agribusiness): Promise<void> {
    this.items.push(agribusiness);
  }
}
