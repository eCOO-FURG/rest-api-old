import { Order } from "@/domain/entities/order";
import { Pix } from "@/domain/entities/pix";
import { User } from "@/domain/entities/user";
import { PaymentsProcessor } from "@/domain/payments/payments-processor";

export class FakePaymentsProcessor implements PaymentsProcessor {
  async register(user: User): Promise<void> {
    return;
  }

  async charge(order: Order): Promise<Pix> {
    const pix = Pix.create({
      order_id: order.id,
      value: order.price,
      key: "##########################################",
      expiration: new Date(Date.now() * 1000 * 60 * 24),
      qrcode: "#######################################",
    });

    return pix;
  }
}
