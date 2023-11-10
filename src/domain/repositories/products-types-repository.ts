import { ProductType } from "../entities/product-type";

export interface ProductsTypesRepository {
  save(productType: ProductType): Promise<void>;
}
