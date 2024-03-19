import { ProductsRepository } from "../../repositories/products-repository";
import { OffersRepository } from "../../repositories/offers-repository";
import { farthestDayBetween } from "../utils/fhartest-day-between";
import { ValidateCycleActionUseCase } from "../market/validate-cycle-action";

interface SearchOffersUseCaseRequest {
  cycle_id: string;
  product: string;
}

export class SearchOffersUseCase {
  constructor(
    private validateCycleUseCase: ValidateCycleActionUseCase,
    private productsRepository: ProductsRepository,
    private offersRepository: OffersRepository
  ) {}

  async execute({ cycle_id, product }: SearchOffersUseCaseRequest) {
    const { cycle } = await this.validateCycleUseCase.execute({
      cycle_id: cycle_id,
      action: "ordering",
    });

    const products = await this.productsRepository.searchManyByName(product);

    const productsIds = products.map((product) => product.id.value);

    const firstOfferingDay = farthestDayBetween(cycle.offering);

    const items =
      await this.offersRepository.findManyItemsByCycleIdProductsIdsAndOfferCreatedAt(
        cycle.id.value,
        productsIds,
        firstOfferingDay
      );

    return {
      items,
    };
  }
}
