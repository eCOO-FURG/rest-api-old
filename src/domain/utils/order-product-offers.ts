import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OfferProduct } from "../entities/offer-product";
import { Product } from "../entities/product";

export function orderProductOffers(
  offers: OfferProduct[],
  products: Product[]
) {
  const offersForEachProduct: {
    id: UniqueEntityID;
    name: string;
    offers: OfferProduct[];
  }[] = offers.reduce(
    (
      acc: { id: UniqueEntityID; name: string; offers: OfferProduct[] }[],
      current
    ) => {
      const { id, name } = products.find(
        (product) => product.id.toString() === current.product_id.toString()
      )!;

      const productIndexOnTheArray = acc.findIndex(
        (product) => name === product.name
      );

      if (productIndexOnTheArray != -1) {
        acc[productIndexOnTheArray].offers.push(current);
      } else {
        acc.push({
          id,
          name,
          offers: [current],
        });
      }

      return acc;
    },
    []
  );

  return offersForEachProduct;
}
