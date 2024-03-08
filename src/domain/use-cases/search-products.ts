import { ProductsRepository } from "../repositories/products-repository";

interface SearchProductsUseCaseRequest {
  name: string;
  page: number;
}

export class SearchProductsUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ name, page }: SearchProductsUseCaseRequest) {
    const products = await this.productsRepository.findManyByNameAndPage(
      name,
      page
    );

    return {
      products,
    };
  }
}
