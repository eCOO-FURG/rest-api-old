import { Product } from "../entities/product";

export interface SearchParams {
  name: string;
}

export interface ProductsRepository {
  findById(id: string): Promise<Product | null>;
  findManyById(ids: string[]): Promise<Product[]>;
  save(product: Product): Promise<void>;
}
