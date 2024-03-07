import { Offer } from "@/domain/entities/offer";
import { OffersRepository } from "@/domain/repositories/offers-repository";

export class InMemoryOffersRepository implements OffersRepository {
  items: Offer[] = [];

  async save(offer: Offer): Promise<void> {
    this.items.push(offer);
  }

  async findManyItemsByProductIds(
    product_ids: string[]
  ): Promise<Offer["items"]> {
    const items: Offer["items"] = [];

    for (const offer of this.items) {
      const match = offer.items.filter(({ product_id }) =>
        product_ids.includes(product_id.value)
      );

      items.push(...match);
    }

    return items;
  }
}
