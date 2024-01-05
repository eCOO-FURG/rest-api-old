import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Order } from "@/domain/entities/order";
import { Order as PrismaOrder, Prisma } from "@prisma/client";

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrder) {
    return Order.create(
      {
        customer_id: new UniqueEntityID(raw.customer_id),
        payment_method: "PIX",
        shipping_address: raw.shipping_address,
        status: raw.status,
        created_at: raw.created_at,
        updated_at: raw.created_at,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      customer_id: order.customer_id.toString(),
      payment_method: order.payment_method,
      shipping_address: order.shipping_address,
      status: order.status,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };
  }
}
