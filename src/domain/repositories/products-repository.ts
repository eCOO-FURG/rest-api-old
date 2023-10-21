import { Product } from "../entities/product";

export interface ProductsRepository {
  save(product: Product): Promise<void>;
  findById(id: string): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
}
