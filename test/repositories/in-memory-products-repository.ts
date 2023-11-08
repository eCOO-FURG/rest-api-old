import { Product } from "@/domain/entities/product";
import {
  ProductsRepository,
  SearchParams,
} from "@/domain/repositories/products-repository";

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

  async search(params: SearchParams): Promise<Product[]> {
    const products = this.items.filter((item) =>
      params.name === "" ? true : item.name.includes(params.name)
    );

    return products;
  }
}
