import { OfferProduct } from "@/domain/entities/offer-product";
import { OffersProductsRepository } from "@/domain/repositories/offers-products-repository";
import { InMemoryOffersRepository } from "./in-memory-offers-repository";

export class InMemoryOffersProductsRepository
  implements OffersProductsRepository
{
  items: OfferProduct[] = [];

  constructor(private inMemoryOffersRepository: InMemoryOffersRepository) {}

  async save(offerProducts: OfferProduct[]): Promise<void> {
    this.items.push(...offerProducts);
  }

  async findManyByProductsIdsAndStatus(
    product_ids: string[]
  ): Promise<OfferProduct[]> {
    const offersProducts = this.items.filter(
      (item) =>
        item.quantity != 0 &&
        product_ids.includes(item.product_id.toString()) &&
        item.quantity > 0
    );

    return offersProducts;
  }

  async update(offerProducts: OfferProduct[]): Promise<void> {
    for (const offerProduct of offerProducts) {
      const itemIndex = this.items.findIndex(
        (item) => item.id.toString() === offerProduct.id.toString()
      );
      this.items[itemIndex] = offerProduct;
    }
  }

  async findManyByIds(ids: string[]): Promise<OfferProduct[]> {
    const offersProducts = this.items.filter((item) =>
      ids.includes(item.id.toString())
    );

    return offersProducts;
  }
}
