import { Offer } from "../entities/offer";
import { OfferProduct } from "../entities/offer-product";

export interface OffersProductsRepository {
  save(items: OfferProduct[]): Promise<void>;
  findManyWithRemainingQuantityOrWeightByProductsIdsAndStatus(
    product_ids: string[],
    status: Offer["status"]
  ): Promise<OfferProduct[]>;
  findManyByIds(ids: string[]): Promise<OfferProduct[]>;
  update(items: OfferProduct[]): Promise<void>;
}
