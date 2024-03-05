import { OfferProduct } from "@/domain/entities/offer-product";
import { Product } from "@/domain/entities/product";

export class OffersPresenter {
  static toHttp(offerProducts: OfferProduct[], products: Product[]) {
    const groupedProducts: Map<
      string,
      { quantity: number; totalPrice: number }
    > = offerProducts.reduce((acc, curr) => {
      const productId = curr.product_id.value;
      if (!acc.has(productId)) {
        acc.set(productId, { quantity: 0, totalPrice: 0 });
      }
      const group = acc.get(productId);
      if (group) {
        group.quantity += curr.quantity_or_weight;
        group.totalPrice += curr.price * curr.quantity_or_weight;
      }
      return acc;
    }, new Map<string, { quantity: number; totalPrice: number }>());

    const mergedOffers = Array.from(groupedProducts).map(
      ([productId, group]) => {
        const price = group.totalPrice / group.quantity;

        const product = products.find((item) => item.id.equals(productId))!;

        const quantityOrWeight =
          product.pricing === "WEIGHT" ? "weight" : "quantity";

        return {
          id: productId,
          name: product.name,
          pricing: product.pricing,
          [quantityOrWeight]: group.quantity.toString(),
          price: price.toFixed(2),
        };
      }
    );

    return mergedOffers;
  }
}
