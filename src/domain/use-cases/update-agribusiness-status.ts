import { AgribusinessesRepository } from "../repositories/agribusinesses-repository";

interface UpdateAgribusinessStatusUseCaseRequest {
  agribusiness_id: string;
}

export class UpdateAgribusinessStatusUseCase {
  constructor(private agribusinessesRepository: AgribusinessesRepository) {}

  async execute({ agribusiness_id }: UpdateAgribusinessStatusUseCaseRequest) {
    const agribusiness = await this.agribusinessesRepository.findById(
      agribusiness_id
    );
    agribusiness!.active = !agribusiness!.active;
    agribusiness!.touch();

    await this.agribusinessesRepository.update(agribusiness!);
  }
}
