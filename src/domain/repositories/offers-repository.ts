import { Offer } from "../entities/offer";

export interface OffersRepository {
  save(offer: Offer): Promise<void>;
  findActive(
    agribusiness_id: string,
    cycle_id: string,
    target_date: Date
  ): Promise<Offer | null>;
  findManyItemsByCycleIdProductsIdsAndCreatedAt(
    cycle_id: string,
    product_ids: string[],
    date: Date
  ): Promise<Offer["items"]>;
}
