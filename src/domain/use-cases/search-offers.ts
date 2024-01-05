import { Collection } from "../repositories/collection";
import { NaturalLanguageProcessor } from "../search/natural-language-processor";
import { ProductsRepository } from "../repositories/products-repository";
import { OffersProductsRepository } from "../repositories/offers-products-repository";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OfferProduct } from "../entities/offer-product";

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

    const availableOffersProducts =
      await this.offersProductsRepository.findManyAvailableByProductsIds(
        productsIds
      );

    const offersForEachProduct = availableOffersProducts.reduce(
      (
        acc: { id: UniqueEntityID; name: string; offers: OfferProduct[] }[],
        current
      ) => {
        const { id, name } = products.find(
          (product) => product.id.toString() === current.product_id.toString()
        )!;

        const productIndexOnTheArray = acc.findIndex(
          (product) => name === product.name
        );

        if (productIndexOnTheArray != -1) {
          acc[productIndexOnTheArray].offers.push(current);
        } else {
          acc.push({
            id,
            name,
            offers: [current],
          });
        }

        return acc;
      },
      []
    );

    return offersForEachProduct;
  }
}
