import { ProductsRepository } from "../repositories/products-repository";
import { NaturalLanguageProcessor } from "../search/natural-language-processor";
import { OffersRepository } from "../repositories/offers-repository";
import { ValidateActionDayUseCase } from "./validate-action-day";

interface SearchOffersUseCaseRequest {
  product: string;
}

export class SearchOffersUseCase {
  constructor(
    private validateActionDayUseCase: ValidateActionDayUseCase,
    private naturalLanguageProcessor: NaturalLanguageProcessor,
    private productsRepository: ProductsRepository,
    private offersRepository: OffersRepository
  ) {}

  async execute({ product }: SearchOffersUseCaseRequest) {
    await this.validateActionDayUseCase.execute({
      action: "ordering",
    });

    const similarProducts = await this.naturalLanguageProcessor.infer(product);

    const productsNames = similarProducts.map((item) => item.name);

    const products = await this.productsRepository.findManyByNames(
      productsNames
    );

    const productsIds = products.map((product) => product.id.value);

    const offersItems = await this.offersRepository.findManyItemsByProductIds(
      productsIds
    );

    return {
      offersItems,
      products,
    };
  }
}
