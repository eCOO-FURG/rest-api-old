import { OffersRepository } from "../../repositories/offers-repository";
import { farthestDayBetween } from "../utils/fhartest-day-between";
import { ValidateCycleActionUseCase } from "../market/validate-cycle-action";

interface SearchOffersUseCaseRequest {
  cycle_id: string;
  product?: string;
  page: number;
}

export class SearchOffersUseCase {
  constructor(
    private validateCycleUseCase: ValidateCycleActionUseCase,
    private offersRepository: OffersRepository
  ) {}

  async execute({ cycle_id, product, page }: SearchOffersUseCaseRequest) {
    const { cycle } = await this.validateCycleUseCase.execute({
      cycle_id: cycle_id,
      action: "ordering",
    });

    const firstOfferingDay = farthestDayBetween(cycle.offering);

    const offersWithAgribusiness =
      await this.offersRepository.findManyActiveWithAgribusiness(
        cycle.id.value,
        firstOfferingDay,
        page,
        product
      );

    return { offersWithAgribusiness };
  }
}
