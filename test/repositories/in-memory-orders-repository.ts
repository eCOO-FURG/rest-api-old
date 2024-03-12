import { Order } from "@/domain/entities/order";
import { OrdersRepository } from "@/domain/repositories/orders-repository";
import { InMemoryOffersRepository } from "./in-memory-offers-repository";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  constructor(private offersRepository: InMemoryOffersRepository) {}

  async findManyByCycleIdAndPage(
    cycle_id: string,
    page: number
  ): Promise<Order[]> {
    const results = this.items.filter((item) => item.cycle_id.equals(cycle_id));

    const start = (page - 1) * 20;
    const end = start + 20;

    return results.slice(start, end);
  }

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

  async update(order: Order): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) {
      return null;
    }

    return order;
  }
}
