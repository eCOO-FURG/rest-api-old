import { OfferProduct } from "@/domain/entities/offer-product";
import { OffersProductsRepository } from "@/domain/repositories/offers-products-repository";
import { InMemoryOffersRepository } from "./in-memory-offers-repository";

export class InMemoryOffersProductsRepository
  implements OffersProductsRepository
{
  items: OfferProduct[] = [];

  constructor(private inMemoryOffersRepository: InMemoryOffersRepository) {}

  async save(offerProduct: OfferProduct): Promise<void> {
    this.items.push(offerProduct);
  }

  async findManyAvailableByProductsIds(
    product_ids: string[]
  ): Promise<OfferProduct[]> {
    const availableOffers =
      await this.inMemoryOffersRepository.findManyByStatus("AVAILABLE");

    const availableOffersIds = availableOffers.map((offer) =>
      offer.id.toString()
    );

    const availableProducts = this.items.filter(
      (item) =>
        item.quantity != 0 &&
        product_ids.includes(item.product_id.toString()) &&
        item.quantity > 0
    );

    return availableProducts;
  }
}
