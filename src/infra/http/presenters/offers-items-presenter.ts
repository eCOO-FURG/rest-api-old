import { Offer } from "@/domain/entities/offer";

export class OffersItemsPresenter {
  static toHttp(items: Offer["items"]) {
    const data: {
      product: {
        id: string;
        name: string;
        image: string;
        pricing: string;
      };
      price: number;
      amount: number;
    }[] = [];

    for (const item of items) {
      const index = data.findIndex((e) => item.product.id.equals(e.product.id));

      if (index > -1) {
        data[index].amount += item.amount;
        const total = data[index].price * data[index].amount;
        data[index].price = (total + item.price) / data[index].amount;
      }

      data.push({
        product: {
          id: item.product.id.value,
          image: item.product.image,
          name: item.product.name,
          pricing: item.product.pricing,
        },
        amount: item.amount,
        price: item.price,
      });
    }

    return data;
  }
}
