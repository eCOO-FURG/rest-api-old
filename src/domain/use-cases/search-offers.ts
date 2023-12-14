import { Collection } from "../repositories/collection";
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
    const queryVector = await this.naturalLanguageProcessor.embed(product);

    const similarProducts = await this.productsCollection.findSimilar(
      queryVector
    );

    const similarProductsIds = similarProducts.map((item) =>
      item.id.toString()
    );

    const products = await this.productsRepository.findManyById(
      similarProductsIds
    );

    const productsIds = products.map((product) => product.id.toString());

    const offers = await this.offersProductsRepository.findManyByProductsIds(
      productsIds
    );

    const offersForEachProduct: { product: string; offers: OfferProduct[] }[] =
      offers.reduce(
        (acc: { product: string; offers: OfferProduct[] }[], current) => {
          const { name } = products.find(
            (product) => product.id.toString() === current.product_id.toString()
          )!;

          const productIndexOnTheArray = acc.findIndex(
            ({ product }) => name === product
          );

          if (productIndexOnTheArray != -1) {
            acc[productIndexOnTheArray].offers.push(current);
          } else {
            acc.push({
              product: name,
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
