import { UUID } from "@/core/entities/uuid";
import { Order } from "@/domain/entities/order";
import { Order as PrismaOrder, Prisma } from "@prisma/client";

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder) {
    return Order.create(
      {
        customer_id: new UUID(raw.customer_id),
        payment_method: "PIX",
        shipping_address: raw.shipping_address,
        status: raw.status,
        created_at: raw.created_at,
        updated_at: raw.created_at,
      },
      new UUID(raw.id)
    );
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.value,
      customer_id: order.customer_id.value,
      payment_method: order.payment_method,
      shipping_address: order.shipping_address,
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };
  }
}
