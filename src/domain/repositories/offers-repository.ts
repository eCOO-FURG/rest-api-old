import { Offer } from "../entities/offer";
import { OfferWithAgribusiness } from "../entities/value-objects/offer-with-agribusiness";

export interface OffersRepository {
  save(offer: Offer): Promise<void>;
  update(offer: Offer): Promise<void>;
  findManyActiveWithAgribusiness(
    cycle_id: string,
    target_date: Date,
    page: number,
    product_name?: string
  ): Promise<OfferWithAgribusiness[]>;
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
