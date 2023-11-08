import { OffersProductsRepository } from "../repositories/offers-products";
import { ProductsRepository } from "../repositories/products-repository";

interface FetchOffersUseCaseRequest {
  // page: number;
  params: {
    name: string;
  };
}

export class FetchOffersUseCase {
  constructor(
    private productsRepository: ProductsRepository,
    private offersProductsRepository: OffersProductsRepository
  ) {}

  async execute({
    // page,
    params,
  }: FetchOffersUseCaseRequest) {
    const products = await this.productsRepository.search({
      name: params.name,
    });

    const offeredProducts =
      await this.offersProductsRepository.findManyByProductsIds(
        products.map((product) => product.id.toString())
      );

    console.log(offeredProducts);

    // const offers = await this.offersRepository.search(page, params);

    // console.log(offers);
  }
}
