import { OfferProduct } from "@/domain/entities/offer-product";

export class OffersPresenter {
  static toHttp(
    offersForEachProduct: { id: string; name: string; offers: OfferProduct[] }[]
  ) {
    return offersForEachProduct.map((item) => ({
      id: item.id.toString(),
      name: item.name,
      quantity: item.offers.reduce(
        (quantity: number, cur: OfferProduct) =>
          quantity + parseInt(cur.quantity),
        0
      ),
    }));
  }
}
