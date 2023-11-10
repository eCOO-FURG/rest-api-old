import { ProductType } from "@/domain/entities/product-type";
import { ProductsTypesRepository } from "@/domain/repositories/products-types-repository";

export class InMemoryProductsTypesRepository
  implements ProductsTypesRepository
{
  public items: ProductType[] = [];

  async save(productType: ProductType): Promise<void> {
    this.items.push(productType);
  }
}
