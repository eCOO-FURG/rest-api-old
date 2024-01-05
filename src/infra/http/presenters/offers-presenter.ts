import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OfferProduct } from "@/domain/entities/offer-product";

export class OffersPresenter {
  static toHttp(
    offersForEachProduct: {
      id: UniqueEntityID;
      name: string;
      offers: OfferProduct[];
    }[]
  ) {
    return offersForEachProduct.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      quantity: item.offers.reduce(
        (quantity: number, cur: OfferProduct) => quantity + cur.quantity,
        0
      ),
    }));
  }
}
