import { CyclesRepository } from "../repositories/cycles-repository";

export class ListCycleUseCase {
  constructor(private cyclesRepository: CyclesRepository) {}

  async execute() {
    const cycles = await this.cyclesRepository.findMany();

    return {
      cycles,
    };
  }
}
