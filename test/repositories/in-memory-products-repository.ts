import { Product } from "@/domain/entities/product";
import { ProductsRepository } from "@/domain/repositories/products-repository";

export class InMemoryProductsRepository implements ProductsRepository {
  items: Product[] = [];

  async save(product: Product): Promise<void> {
    this.items.push(product);
  }

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.equals(id));

    if (!product) return null;

    return product;
  }

  async searchManyByName(name: string, page = 1): Promise<Product[]> {
    const results = this.items.filter((item) => name.includes(item.name));

    const start = (page - 1) * 20;
    const end = start + 20;

    return results.slice(start, end);
  }
}
