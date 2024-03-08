import { ProductsRepository } from "../repositories/products-repository";
import { NaturalLanguageProcessor } from "../search/natural-language-processor";
import { OffersRepository } from "../repositories/offers-repository";
import { ValidateScheduleUseCase } from "./validate-schedule";

interface SearchOffersUseCaseRequest {
  product: string;
}

export class SearchOffersUseCase {
  constructor(
    private validateScheduleCase: ValidateScheduleUseCase,
    private naturalLanguageProcessor: NaturalLanguageProcessor,
    private productsRepository: ProductsRepository,
    private offersRepository: OffersRepository
  ) {}

  async execute({ product }: SearchOffersUseCaseRequest) {
    const schedule = await this.validateScheduleCase.execute({
      action: "ordering",
    });

    const similarProducts = await this.naturalLanguageProcessor.infer(product);

    const productsNames = similarProducts.map((item) => item.name);

    const products = await this.productsRepository.findManyByNames(
      productsNames
    );

    const productsIds = products.map((product) => product.id.value);

    const lastOfferingDay = schedule.cycle.offering
      .sort((a, b) => a - b)
      .reverse()[0];

    const lastOfferingDate = new Date(
      schedule.start_at.getTime() + (lastOfferingDay - 1) * 24 * 60 * 60 * 1000
    );

    lastOfferingDate.setHours(23, 59, 59, 999);

    const offersItems =
      await this.offersRepository.findManyItemsByProductIdsAndCreatedAtOlderOrEqualThan(
        productsIds,
        lastOfferingDate
      );

    return {
      offersItems,
      products,
    };
  }
}
