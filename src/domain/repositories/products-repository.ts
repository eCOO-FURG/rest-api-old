import { Product } from "../entities/product";

export interface SearchParams {
  name: string;
}

export interface ProductsRepository {
  findById(id: string): Promise<Product | null>;
  findByName(name: string): Promise<Product | null>;
  save(product: Product): Promise<void>;
  search(params: SearchParams): Promise<Product[]>;
}
