import { OfferProduct } from "../entities/offer-product";

export interface OffersProductsRepository {
  save(offerProduct: OfferProduct): Promise<void>;
}
