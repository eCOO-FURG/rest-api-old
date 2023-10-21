import { Product } from "@/domain/entities/product";
import { ProductsRepository } from "@/domain/repositories/products-repository";

export class InMemoryProductsRepository implements ProductsRepository {
  items: Product[] = [];

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.toString() === id);

    if (!product) return null;

    return product;
  }

  async findByName(name: string): Promise<Product | null> {
    const product = this.items.find((item) => item.name === name);

    if (!product) {
      return null;
    }

    return product;
  }

  async save(product: Product): Promise<void> {
    this.items.push(product);
  }
}
