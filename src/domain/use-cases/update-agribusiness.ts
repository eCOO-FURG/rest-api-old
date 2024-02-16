import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";
import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";

interface UpdateAgribusinessUseCaseRequest {
  agribusiness_id: string;
  caf: string;
  name: string;
  active: boolean;
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

    if (caf != agribusiness!.caf) {
      const agribusinessWithSameCaf =
        await this.agribusinessesRepository.findByCaf(caf.toString());

      if (agribusinessWithSameCaf) {
        throw new ResourceAlreadyExistsError(caf.toString());
      }
    }

    agribusiness!.name = name;
    agribusiness!.caf = caf;
    agribusiness!.active = active;
    agribusiness!.touch();

    await this.agribusinessesRepository.update(agribusiness!);
  }
}
