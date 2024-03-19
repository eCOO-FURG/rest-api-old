import { Offer } from "@/domain/entities/offer";
import { OffersRepository } from "@/domain/repositories/offers-repository";

export class InMemoryOffersRepository implements OffersRepository {
  items: Offer[] = [];

  async save(offer: Offer): Promise<void> {
    this.items.push(offer);
  }

  async update(offer: Offer): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(offer.id));

    this.items[index] = offer;
  }

  findManyByOffersIdsAndProductsIds(
    offers_ids: string[],
    products_ids: string[]
  ): Promise<Offer[]> {
    throw new Error("Method not implemented.");
  }

  async findManyItemsByCycleIdProductsIdsAndOfferCreatedAt(
    cycle_id: string,
    product_ids: string[],
    date: Date
  ): Promise<Offer["items"]> {
    const items: Offer["items"] = [];

    for (const offer of this.items) {
      const match = offer.items.filter(({ product }) => {
        return (
          product_ids.includes(product.id.value) &&
          offer.created_at >= date &&
          offer.cycle_id.equals(cycle_id)
        );
      });
      items.push(...match);
    }

    return items;
  }

  async findActive(
    agribusiness_id: string,
    cycle_id: string,
    target_date: Date
  ): Promise<Offer | null> {
    const offer = this.items.find(
      (item) =>
        item.agribusiness_id.equals(agribusiness_id) &&
        item.cycle_id.equals(cycle_id) &&
        item.created_at >= target_date
    );

    if (!offer) {
      return null;
    }

    return offer;
  }
}
