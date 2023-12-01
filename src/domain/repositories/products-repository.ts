import { Product } from "../entities/product";

export interface SearchParams {
  name: string;
}

export interface ProductsRepository {
  findById(id: string): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  findManyByName(names: string[]): Promise<Product[]>;
  save(product: Product): Promise<void>;
}
