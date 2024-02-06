import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";
import { Agribusiness } from "../entities/agribusiness";
import { AgribusinessProps } from "../entities/agribusiness";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";

interface UpdateAgribusinessUseCaseRequest {
  agribusiness_id: string;
  caf?: string;
  name?: string;
  active?: boolean;
}

export class UpdateAgribusinessUseCase {
  constructor(private agribusinessesRepository: AgribusinessesRepository) {}

  async execute({
    agribusiness_id,
    caf,
    name,
    active,
  }: UpdateAgribusinessUseCaseRequest) {
    const agribusiness = await this.agribusinessesRepository.findById(
      agribusiness_id
    );

    if (!agribusiness) {
      throw new ResourceNotFoundError(agribusiness_id);
    }

    const agribusinessWithSameCaf =
      await this.agribusinessesRepository.findByCaf(caf as string);

    if (agribusinessWithSameCaf) {
      throw new ResourceAlreadyExistsError(caf as string);
    }

    const updates: Partial<AgribusinessProps> = {};

    if (caf !== undefined) {
      updates.caf = caf;
    }

    if (name !== undefined) {
      updates.name = name;
    }

    if (active !== undefined) {
      updates.active = active;
    }

    const updatedAgribusiness = Agribusiness.update(agribusiness, updates);

    return updatedAgribusiness;
  }
}
