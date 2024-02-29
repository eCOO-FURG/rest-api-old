import { Order } from "@/domain/entities/order";
import { OrdersRepository } from "@/domain/repositories/orders-repository";

export class InMemoryOrdersRepository implements OrdersRepository {
  items: Order[] = [];

  async save(order: Order): Promise<void> {
    this.items.push(order);
  }

  async update(order: Order): Promise<void> {
    const orderIndex = this.items.findIndex(
      (item) => item.id.toString() === order.id.toString()
    );

    if (orderIndex >= 0) {
      this.items[orderIndex] = order;
    }
  }

  async findById(id: string): Promise<Order | null> {
    const order = this.items.find((item) => item.id.toString() === id);

    if (!order) {
      return null;
    }

    return order;
  }

  async findByStatus(status: string): Promise<Order[]> {
    const ordersWithStatus = this.items.filter(
      (order) => order.status === status
    );
    return ordersWithStatus;
  }
}
