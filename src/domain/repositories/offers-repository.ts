import { Offer } from "../entities/offer";
import { OfferProduct } from "../entities/offer-product";

export interface OffersRepository {
  save(offer: Offer): Promise<void>;
  findManyItemsByProductIds(product_ids: string[]): Promise<OfferProduct[]>;
}
