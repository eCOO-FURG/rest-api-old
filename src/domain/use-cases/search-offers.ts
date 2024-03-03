import { ProductsRepository } from "../repositories/products-repository";
import { NaturalLanguageProcessor } from "../search/natural-language-processor";
import { OffersRepository } from "../repositories/offers-repository";

interface SearchOffersUseCaseRequest {
  product: string;
}

export class SearchOffersUseCase {
  constructor(
    private naturalLanguageProcessor: NaturalLanguageProcessor,
    private productsRepository: ProductsRepository,
    private offersRepository: OffersRepository
  ) {}

  async execute({ product }: SearchOffersUseCaseRequest) {
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
    };
  }
}
