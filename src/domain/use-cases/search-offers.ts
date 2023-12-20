import { Collection } from "../repositories/collection";
import { NaturalLanguageProcessor } from "../search/natural-language-processor";
import { ProductsRepository } from "../repositories/products-repository";
import { OffersProductsRepository } from "../repositories/offers-products-repository";
import { reduceProductOffers } from "../utils/reduce-product-offers";

interface SearchOffersUseCaseRequest {
  product: string;
}

export class SearchOffersUseCase {
  constructor(
    private naturalLanguageProcessor: NaturalLanguageProcessor,
    private productsCollection: Collection,
    private productsRepository: ProductsRepository,
    private offersProductsRepository: OffersProductsRepository
  ) {}

  async execute({ product }: SearchOffersUseCaseRequest) {
    const productEmbedding = await this.naturalLanguageProcessor.embed(product);

    const similarProducts = await this.productsCollection.findSimilar(
      productEmbedding
    );

    const similarProductsIds = similarProducts.map((item) =>
      item.id.toString()
    );

    const products = await this.productsRepository.findManyByIds(
      similarProductsIds
    );

    const productsIds = products.map((product) => product.id.toString());

    const offers = await this.offersProductsRepository.findManyByProductsIds(
      productsIds
    );

    const offersForEachProduct = reduceProductOffers(offers, products);

    return offersForEachProduct;
  }
}
