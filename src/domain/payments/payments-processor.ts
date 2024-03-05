import { Order } from "../entities/order";
import { Pix } from "../entities/pix";
import { User } from "../entities/user";

export interface PaymentsProcessor {
  register(user: User): Promise<void>;
  charge(order: Order): Promise<Pix>;
}
