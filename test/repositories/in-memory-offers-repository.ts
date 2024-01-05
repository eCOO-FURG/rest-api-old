import { Offer } from "@/domain/entities/offer";
import { OffersRepository } from "@/domain/repositories/offers-repository";

export class InMemoryOffersRepository implements OffersRepository {
  items: Offer[] = [];

  async save(offer: Offer): Promise<void> {
    this.items.push(offer);
  }

  async findManyByStatus(status: Offer["status"]) {
    const offers = this.items.filter((offer) => offer.status === status);

    return offers;
  }
}
