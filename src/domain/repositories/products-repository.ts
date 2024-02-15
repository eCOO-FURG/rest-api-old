import { Product } from "../entities/product";

export interface ProductsRepository {
  findById(id: string): Promise<Product | null>;
  findManyByIds(ids: string[]): Promise<Product[]>;
  findManyByNames(names: string[]): Promise<Product[]>;
  save(product: Product): Promise<void>;
}
