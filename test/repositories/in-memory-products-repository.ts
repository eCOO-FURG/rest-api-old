import { Product } from "@/domain/entities/product";
import { ProductsRepository } from "@/domain/repositories/products-repository";

export class InMemoryProductsRepository implements ProductsRepository {
  items: Product[] = [];

  async findById(id: string): Promise<Product | null> {
    const product = this.items.find((item) => item.id.equals(id));

    if (!product) return null;

    return product;
  }

  async findManyByIds(ids: string[]): Promise<Product[]> {
    const products = this.items.filter((item) => ids.includes(item.id.value));

    return products;
  }

  async findManyByNames(names: string[]): Promise<Product[]> {
    const products = this.items.filter((item) => names.includes(item.name));

    return products;
  }

  async findManyByNameAndPage(name: string, page: number): Promise<Product[]> {
    const results = this.items.filter((item) => name.includes(item.name));

    const start = (page - 1) * 20;
    const end = start + 20;

    return results.slice(start, end);
  }

  async save(product: Product): Promise<void> {
    this.items.push(product);
  }
}
