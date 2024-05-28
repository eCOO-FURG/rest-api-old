import { Offer } from "../entities/offer";

export interface OffersRepository {
  save(offer: Offer): Promise<void>;
  update(offer: Offer): Promise<void>;
  findActive(
    agribusiness_id: string,
    cycle_id: string,
    target_date: Date
  ): Promise<Offer | null>;
  findManyByOffersIdsAndProductsIds(
    offers_ids: string[],
    products_ids: string[]
  ): Promise<Offer[]>;
  findManyItemsByCycleIdProductsIdsAndOfferCreatedAt(
    cycle_id: string,
    product_ids: string[],
    date: Date,
    page?: number
  ): Promise<Offer["items"]>;
}
