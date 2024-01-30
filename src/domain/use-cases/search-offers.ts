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

    const offersProductsWithRemainingQuantity =
      await this.offersProductsRepository.findManyWithRemainingQuantityByProductsIdsAndStatus(
        productsIds,
        "AVAILABLE"
      );

    const productsOffered = offersProductsWithRemainingQuantity.reduce(
      (
        items: {
          id: UniqueEntityID;
          name: string;
          offers: OfferProduct[];
        }[],
        current
      ) => {
        const productIndex = items.findIndex((item) =>
          item.id.equals(current.product_id)
        );

        if (productIndex >= 0) {
          items[productIndex].offers.push(current);
        } else {
          const product = products.find((product) =>
            product.id.equals(current.product_id)
          );

          if (product) {
            items.push({
              id: product.id,
              name: product.name,
              offers: [current],
            });
          }
        }

        return items;
      },
      []
    );

    return productsOffered;
  }
}
