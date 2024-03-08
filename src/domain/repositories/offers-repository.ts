import { Offer } from "../entities/offer";

export interface OffersRepository {
  save(offer: Offer): Promise<void>;
  findManyItemsByProductIdsAndCreatedAtOlderOrEqualThan(
    product_ids: string[],
    date: Date
  ): Promise<Offer["items"]>;
}
