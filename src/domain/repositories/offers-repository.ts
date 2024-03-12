import { Offer } from "../entities/offer";

export interface OffersRepository {
  save(offer: Offer): Promise<void>;
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
    date: Date
  ): Promise<Offer["items"]>;
  updateItem(offer: Offer["items"][0]): Promise<void>;
  saveItem(offer: Offer["items"][0]): Promise<void>;
}
