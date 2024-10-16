import { Agribusiness } from "@/domain/entities/agribusiness";
import { Offer } from "@/domain/entities/offer";
import { Order } from "@/domain/entities/order";

export class OrderWithItemsPresenter {
  static toHttp(order: Order, offers: Offer[], agribusinesses: Agribusiness[]) {
    const items: {
      agribusiness: {
        id: string;
        name: string;
        caf: string;
        products: {
          id: string;
          image: string;
          amount: number;
          description?: string | null;
        }[];
      };
    }[] = [];

    for (let i = 0; i < order.items.length; i++) {
      const offerIndex = offers.findIndex((item) =>
        item.id.equals(order.items[i].offer_id)
      );

      const agribusiness = agribusinesses.findIndex((item) =>
        item.id.equals(offers[offerIndex].agribusiness_id)
      );

      const found = items.findIndex((item) =>
        agribusinesses[agribusiness].id.equals(item.agribusiness.id)
      );

      const offer = offers[offerIndex];

      const offerItem = offer.find(order.items[i].product);

      if (!offerItem) {
        continue;
      }

      const product = {
        id: order.items[i].product.id.value,
        name: order.items[i].product.name,
        image: order.items[i].product.image,
        amount: order.items[i].amount,
        description: offerItem.description,
      };

      if (found > -1) {
        items[found].agribusiness.products.push(product);
      } else {
        items.push({
          agribusiness: {
            id: agribusinesses[agribusiness].id.value,
            name: agribusinesses[agribusiness].name,
            caf: agribusinesses[agribusiness].caf,
            products: [product],
          },
        });
      }
    }

    return {
      id: order.id.value,
      payment_method: order.payment_method,
      shipping_address: order.shipping_address,
      price: order.price,
      status: order.status,
      customer: {
        first_name: order.customer.first_name,
        last_name: order.customer.last_name,
        email: order.customer.email,
        phone: order.customer.phone,
      },
      items,
    };
  }
}
