import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";

interface AgribusinessListingUseCaseRequest {
  page: number;
}

export class AgribusinessListingUseCase {
  constructor(private agribusinessRepository: AgribusinessesRepository) {}

  async execute({ page }: AgribusinessListingUseCaseRequest) {
    const pageSize = 20;

    const agribusinesses =
      await this.agribusinessRepository.findAllSortedByName(page, pageSize);

    return agribusinesses;
  }
}
