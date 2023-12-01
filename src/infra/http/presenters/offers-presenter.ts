import { OfferProduct } from "@/domain/entities/offer-product";

export class OffersPresenter {
  static toHttp(
    offersForEachProduct: { product: string; offers: OfferProduct[] }[]
  ) {
    const formattedOffers: { [key: string]: any } = {};

    offersForEachProduct.forEach((productOffers) => {
      const { product, offers } = productOffers;

      if (formattedOffers[product]) {
        offers.forEach((offer) => {
          formattedOffers[product].amount += parseInt(offer.amount);
          formattedOffers[product].quantity += parseInt(offer.quantity);
          formattedOffers[product].weight += parseInt(offer.weight);
        });
      } else {
        formattedOffers[product] = {
          product,
          amount: 0,
          quantity: 0,
          weight: 0,
        };

        offers.forEach((offer) => {
          formattedOffers[product].amount += parseInt(offer.amount);
          formattedOffers[product].quantity += parseInt(offer.quantity);
          formattedOffers[product].weight += parseInt(offer.weight);
        });
      }
    });

    const result = Object.keys(formattedOffers).map(
      (key) => formattedOffers[key]
    );
    return JSON.stringify(result);
  }
}
