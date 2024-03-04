import { UUID } from "@/core/entities/uuid";
import { OfferProduct } from "@/domain/entities/offer-product";

export class OffersPresenter {
  static toHttp(
    offersForEachProduct: {
      id: UUID;
      name: string;
      offers: OfferProduct[];
    }[]
  ) {
    return offersForEachProduct.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      quantity_or_weight: item.offers.reduce(
        (quantity_or_weight: number, cur: OfferProduct) =>
          quantity_or_weight + cur.quantity_or_weight,
        0
      ),
    }));
  }
}
