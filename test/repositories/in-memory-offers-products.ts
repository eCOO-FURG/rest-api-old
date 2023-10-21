import { OfferProduct } from "@/domain/entities/offer-product";
import { OffersProductsRepository } from "@/domain/repositories/offers-products";

export class InMemoryOffersProductsRepository
  implements OffersProductsRepository
{
  items: OfferProduct[] = [];

  async save(offerProduct: OfferProduct): Promise<void> {
    this.items.push(offerProduct);
  }
}
