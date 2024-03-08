import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";

interface SingleAgribusinessListingUseCaseRequest {
  agribusiness_id: string;
}

export class SingleAgribusinessListingUseCase {
  constructor(private agribusinessesRepository: AgribusinessesRepository) {}

  async execute({ agribusiness_id }: SingleAgribusinessListingUseCaseRequest) {
    const agribusiness = await this.agribusinessesRepository.findById(
      agribusiness_id
    );

    if (!agribusiness) {
      throw new ResourceNotFoundError("Agronegócio", agribusiness_id);
    }

    return agribusiness;
  }
}
