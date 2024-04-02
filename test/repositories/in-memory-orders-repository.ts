import { Order } from "@/domain/entities/order";
import { OrdersRepository } from "@/domain/repositories/orders-repository";
import { InMemoryOffersRepository } from "./in-memory-offers-repository";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  constructor(private offersRepository: InMemoryOffersRepository) {}

  async save(order: Order): Promise<void> {
    this.items.push(order);
  }

  async update(order: Order): Promise<void> {
    const index = this.items.findIndex((item) => item.id.equals(order.id));

    this.items[index] = order;

    if (order.status === "CANCELED") {
      const offersItems = this.offersRepository.items.flatMap(
        (offer) => offer.items
      );

      for (const item of order.items) {
        const index = offersItems.findIndex((e) =>
          e.product.equals(item.product)
        );

        offersItems[index].amount += item.amount;
      }

      for (const offerItem of offersItems) {
        const offerIndex = this.offersRepository.items.findIndex((e) =>
          e.id.equals(offerItem.offer_id)
        );

        const offerItemIndex = this.offersRepository.items[
          offerIndex
        ].items.findIndex((e) => e.product.equals(offerItem.product));

        this.offersRepository.items[offerIndex].items[offerItemIndex] =
          offerItem;
      }
    }
  }

  async findByIdWithItems(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.equals(id));

    if (!order) {
      return null;
    }

    return order;
  }

  async findManyByCycleIdAndPage(
    cycle_id: string,
    page: number
  ): Promise<Order[]> {
    const results = this.items.filter((item) => item.cycle_id.equals(cycle_id));

    const start = (page - 1) * 20;
    const end = start + 20;

    return results.slice(start, end);
  }
}
