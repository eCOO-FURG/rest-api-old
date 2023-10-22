import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";
import { ProductsRepository } from "../repositories/products-repository";
import { Product } from "../entities/product";

interface RegisterProductUseCaseRequest {
  name: string;
}

export class RegisterProductUseCase {
  constructor(private productsRepository: ProductsRepository) {}

  async execute({ name }: RegisterProductUseCaseRequest) {
    const productWithSameName = await this.productsRepository.findByName(name);

    if (productWithSameName) {
      throw new ResourceAlreadyExistsError(name);
    }

    const product = Product.create({
      name,
    });

    await this.productsRepository.save(product);
  }
}
