import { OfferProduct } from "@/domain/entities/offer-product";

export function calculateAveragePrice(products: OfferProduct[]) {
  const totalAmount = products.reduce(
    (acc, curr) => acc + parseFloat(curr.amount),
    0
  );
  return totalAmount / products.length;
}
