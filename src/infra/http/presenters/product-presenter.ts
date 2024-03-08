import { Product } from "@/domain/entities/product";

export class ProductPresenter {
  static toHttp(products: Product[]) {
    const mappedProducts = products.map((item) => ({
      id: item.id,
      name: item.name,
      image: item.image,
      pricing: item.pricing,
    }));

    return mappedProducts;
  }
}
