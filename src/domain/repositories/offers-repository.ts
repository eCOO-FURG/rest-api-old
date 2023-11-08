import { Offer } from "../entities/offer";

export interface SearchParams {
  products_ids: string[];
}

export interface OffersRepository {
  save(offer: Offer): Promise<void>;
  search(page: number, params?: SearchParams): Promise<Offer[]>;
}
