import { Collection } from "../search/collection";
import { NaturalLanguageProcessor } from "../search/natural-language-processor";
import { ProductsRepository } from "../repositories/products-repository";
import { OfferProduct } from "../entities/offer-product";
import { OffersProductsRepository } from "../repositories/offers-products-repository";
import { Product } from "../entities/product";

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
    const queryVector = await this.naturalLanguageProcessor.embeed(product);

    const similarProducts = await this.productsCollection.findSimilar(
      queryVector
    );

    const similarProductsNames = similarProducts.map(
      (item) => item.payload.name
    );

    const products = (await Promise.all(
      similarProductsNames.map(
        async (name) => await this.productsRepository.findByName(name)
      )
    ).then((data) => data.filter((product) => product))) as Product[];

    const offeredProducts =
      await this.offersProductsRepository.findManyByProductsIds(
        products.map((product) => product.id.toString())
      );

    const offersForEachProduct: OfferProduct[][] = offeredProducts.reduce(
      (acc: OfferProduct[][], current: OfferProduct) => {
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
