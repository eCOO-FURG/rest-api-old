import { OfferProduct } from "@/domain/entities/offer-product";
import { OffersProductsRepository } from "@/domain/repositories/offers-products-repository";

export class InMemoryOffersProductsRepository
  implements OffersProductsRepository
{
  items: OfferProduct[] = [];

  async save(offerProduct: OfferProduct): Promise<void> {
    this.items.push(offerProduct);
  }

  async findManyByProductsIds(product_ids: string[]): Promise<OfferProduct[]> {
    const offerProducts = this.items.filter((item) =>
      product_ids.includes(item.product_id.toString())
    );

    return offerProducts;
  }
}
