import { Product } from "../entities/product";

export interface ProductsRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  searchManyByName(name: string, page?: number): Promise<Product[]>;
}
