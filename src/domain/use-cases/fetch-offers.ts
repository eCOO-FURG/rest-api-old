import { string, unknown } from "zod";
import { OffersProductsRepository } from "../repositories/offers-products";
import { ProductsRepository } from "../repositories/products-repository";
import { OfferProduct } from "../entities/offer-product";

interface FetchOffersUseCaseRequest {
  name: string;
}

export class FetchOffersUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private offersProductsRepository: OffersProductsRepository
  ) {}

  async execute({ name }: FetchOffersUseCaseRequest) {
    const products = await this.productsRepository.search({
      name: name,
    });

    const offeredProducts =
      await this.offersProductsRepository.findManyByProductsIds(
        products.map((product) => product.id.toString())
      );

    const offersForEachProduct: OfferProduct[][] = offeredProducts.reduce(
      (acc: OfferProduct[][], current) => {
        const found = acc.find(
          (itemArray) =>
            itemArray[0].product_id.toString() === current.product_id.toString()
        );

        if (found) {
          found.push(current);
        } else {
          acc.push([current]);
        }

        return acc;
      },
      []
    );

    return offersForEachProduct;
  }
}
