import { ProductsRepository } from "../repositories/products-repository";
import { OffersProductsRepository } from "../repositories/offers-products-repository";
import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OfferProduct } from "../entities/offer-product";
import { RemoteNaturalLanguageProcessor } from "../search/remote-natural-language-processor";

interface SearchOffersUseCaseRequest {
  product: string;
}

export class SearchOffersUseCase {
  constructor(
    private naturalLanguageProcessor: RemoteNaturalLanguageProcessor,
    private productsRepository: ProductsRepository,
    private offersProductsRepository: OffersProductsRepository
  ) {}

  async execute({ product }: SearchOffersUseCaseRequest) {
    const similarProducts = await this.naturalLanguageProcessor.infer(
      product,
      "products",
      10
    );

    const similarProductsNames = similarProducts.map((item) => item.name);

    const products = await this.productsRepository.findManyByNames(
      similarProductsNames
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
