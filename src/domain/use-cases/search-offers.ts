import { ProductsRepository } from "../repositories/products-repository";
import { NaturalLanguageProcessor } from "../search/natural-language-processor";
import { OffersRepository } from "../repositories/offers-repository";
import { ValidateCycleUseCase } from "./validate-cycle";
import { farthest } from "./utils/fhartest";

interface SearchOffersUseCaseRequest {
  cycle_id: string;
  product: string;
}

export class SearchOffersUseCase {
  constructor(
    private validateCycleUseCase: ValidateCycleUseCase,
    private naturalLanguageProcessor: NaturalLanguageProcessor,
    private productsRepository: ProductsRepository,
    private offersRepository: OffersRepository
  ) {}

  async execute({ cycle_id, product }: SearchOffersUseCaseRequest) {
    const { cycle } = await this.validateCycleUseCase.execute({
      cycle_id: cycle_id,
      action: "ordering",
    });

    const similarProducts = await this.naturalLanguageProcessor.infer(product);

    const productsNames = similarProducts.map((item) => item.name);

    const products = await this.productsRepository.findManyByNames(
      productsNames
    );

    const productsIds = products.map((product) => product.id.value);

    const firstOfferingDay = farthest(cycle.offering);

    const offersItems =
      await this.offersRepository.findManyItemsByCycleIdProductsIdsAndOfferCreatedAt(
        cycle.id.value,
        productsIds,
        firstOfferingDay
      );

    return {
      offersItems,
      products,
    };
  }
}
