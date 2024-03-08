import { Order } from "@/domain/entities/order";
import { OrdersRepository } from "@/domain/repositories/orders-repository";
import { InMemoryOffersRepository } from "./in-memory-offers-repository";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  constructor(private offersRepository: InMemoryOffersRepository) {}

  async save(order: Order): Promise<void> {
    this.items.push(order);

    for (const item of order.items) {
      const offer = this.offersRepository.items.find((offer) =>
        offer.id.equals(item.id.value)
      );

      if (!offer) {
        return;
      }

      const index = offer.items.findIndex((offerItem) =>
        offerItem.product_id.equals(item.id.value)
      );

      offer.items[index].quantity_or_weight -= item.quantity_or_weight;
    }
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) {
      return null;
    }

    return order;
  }
}
