import { Offer } from "@/domain/entities/offer";
import { OfferProduct } from "@/domain/entities/offer-product";
import { OffersRepository } from "@/domain/repositories/offers-repository";

export class InMemoryOffersRepository implements OffersRepository {
  items: Offer[] = [];

  async save(offer: Offer): Promise<void> {
    this.items.push(offer);
  }

  async findManyItemsByProductIds(
    product_ids: string[]
  ): Promise<OfferProduct[]> {
    const items: OfferProduct[] = [];

    for (const offer of this.items) {
      const match = offer.items.filter(({ product_id }) =>
        product_ids.includes(product_id.value)
      );

      items.push(...match);
    }

    return items;
  }
}
