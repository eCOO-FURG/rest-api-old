import { Offer } from "@/domain/entities/offer";
import { Product } from "@/domain/entities/product";

export class OffersPresenter {
  static toHttp(items: Offer["items"], products: Product[]) {
    const data: {
      id: string;
      name: string;
      weight?: number;
      units?: number;
      price: string;
    }[] = [];

    items.forEach((item) => {
      const product = products.find((product) =>
        product.id.equals(item.product_id)
      );

      if (!product) {
        return;
      }

      const found = data.findIndex(
        (offer) => offer.id === item.product_id.value
      );

      const value = {
        id: item.product_id.value,
        name: product.name,
        price: item.price.toString(),
      };

      if (found > -1) {
        if ("units" in data[found]) {
          data[found].units! += item.quantity_or_weight;
        } else {
          data[found].weight! += item.quantity_or_weight;
        }
        const numberPrice = Number(data[found].price);
        data[found].price = (numberPrice + item.price / 2).toString();
      } else {
        if (product.pricing === "WEIGHT") {
          Object.assign(value, {
            weight: item.quantity_or_weight,
          });
        } else {
          Object.assign(value, {
            units: item.quantity_or_weight,
          });
        }
        data.push(value);
      }
    });
    return data;
  }
}
