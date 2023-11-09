import { Offer } from "../entities/offer";

export interface OffersRepository {
  save(offer: Offer): Promise<void>;
}
