import { OfferProduct } from "../entities/offer-product";

export interface OffersProductsRepository {
  save(offerProduct: OfferProduct): Promise<void>;
  findManyAvailableByProductsIds(
    product_ids: string[]
  ): Promise<OfferProduct[]>;
}
