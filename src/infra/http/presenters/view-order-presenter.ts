import { Agribusiness } from "@/domain/entities/agribusiness";
import { Offer } from "@/domain/entities/offer";
import { Order } from "@/domain/entities/order";
import { Product } from "@/domain/entities/product";
import { User } from "@/domain/entities/user";

export class ViewOrderPresenter {
  static toHttp(
    user: User,
    order: Order,
    offers: Offer[],
    products: Product[],
    agribusinesses: Agribusiness[]
  ) {
    const items: {
      agribusiness: string;
      products: {
        name: string;
        units?: number;
        weight?: number;
        price: number;
      }[];
    }[] = [];

    for (let i = 0; i < order.items.length; i++) {
      const offer = offers.findIndex((item) =>
        item.id.equals(order.items[i].offer_id)
      );

      const agribusiness = agribusinesses.findIndex((item) =>
        item.id.equals(offers[offer].agribusiness_id)
      );

      const product = products.findIndex((item) =>
        item.id.equals(order.items[i].product_id)
      );

      const offerItem = offers[offer].items.findIndex((item) =>
        item.product_id.equals(products[product].id)
      );

      const found = items.findIndex(
        (item) => item.agribusiness === agribusinesses[agribusiness].name
      );

      const data = {
        name: products[product].name,
        price: offers[offer].items[offerItem].price,
      };

      if (products[product].pricing === "WEIGHT") {
        Object.assign(data, {
          weight: order.items[i].quantity_or_weight,
        });
      } else {
        Object.assign(data, {
          units: order.items[i].quantity_or_weight,
        });
      }

      if (found > -1) {
        items[found].products.push(data);
      } else {
        items.push({
          agribusiness: agribusinesses[agribusiness].name,
          products: [data],
        });
      }
    }

    return {
      customer: `${user.first_name} ${user.last_name}`,
      price: order.price,
      payment_method: order.payment_method,
      status: order.status,
      items,
    };
  }
}
