import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AgribusinessesRepository } from "../../repositories/agribusinesses-repository";
import { ResourceAlreadyExistsError } from "../errors/resource-already-exists-error";

interface UpdateAgribusinessUseCaseRequest {
  agribusiness_id: string;
  caf: string;
  name: string;
}

export class UpdateAgribusinessUseCase {
  constructor(private agribusinessesRepository: AgribusinessesRepository) {}

  async execute({
    agribusiness_id,
    caf,
    name,
  }: UpdateAgribusinessUseCaseRequest) {
    const agribusiness = await this.agribusinessesRepository.findById(
      agribusiness_id
    );

    if (!agribusiness) {
      throw new ResourceNotFoundError("Agronegócio", agribusiness_id);
    }

    if (caf != agribusiness.caf) {
      const agribusinessWithSameCaf =
        await this.agribusinessesRepository.findByCaf(caf);

      if (agribusinessWithSameCaf) {
        throw new ResourceAlreadyExistsError("CAF", caf);
      }
    }

    agribusiness.name = name;
    agribusiness.caf = caf;
    agribusiness.touch();

    await this.agribusinessesRepository.update(agribusiness!);
  }
}
