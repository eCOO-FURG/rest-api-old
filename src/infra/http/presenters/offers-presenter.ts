import { OfferProduct } from "@/domain/entities/offer-product";
import { calculateAveragePrice } from "@/infra/utils/calculate-average-price";

export class OffersPresenter {
  static toHttp(offers: OfferProduct[][]) {
    return offers.map((products) => {
      const totalQuantity = products.reduce(
        (acc, curr) => acc + parseFloat(curr.quantity),
        0
      );

      const totalWeight = products.reduce(
        (acc, curr) => acc + parseFloat(curr.weight),
        0
      );

      const averageAmount = calculateAveragePrice(products);

      return {
        product_id: products[0].product_id.toString(),
        amount: averageAmount.toString(),
        quantity: totalQuantity.toString(),
        weight: totalWeight.toString(),
        created_at: products[0].created_at,
        updated_at: products[0].updated_at || null,
      };
    });
  }
}
