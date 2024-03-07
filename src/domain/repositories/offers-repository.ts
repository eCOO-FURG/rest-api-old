import { Offer } from "../entities/offer";

export interface OffersRepository {
  save(offer: Offer): Promise<void>;
  findManyItemsByProductIds(product_ids: string[]): Promise<Offer["items"]>;
}
