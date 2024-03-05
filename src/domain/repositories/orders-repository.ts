import { Order } from "../entities/order";

export interface OrdersRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findManyByDate(page: number, pageSize: number): Promise<Order[]>;
}
