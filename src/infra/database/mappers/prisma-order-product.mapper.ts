import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OrderProduct } from "@/domain/entities/order-products";
import { Prisma, OrderProduct as PrismaOrderProduct } from "@prisma/client";

export class PrismaOrderProductMapper {
  static toDomain(raw: PrismaOrderProduct) {
    return OrderProduct.create(
      {
        order_id: new UniqueEntityID(raw.order_id),
        product_id: new UniqueEntityID(raw.product_id),
        quantity: raw.quantity,
        offer_product_id: new UniqueEntityID(raw.offer_product_id),
        created_at: raw.created_at,
        updated_at: raw.created_at,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    orderProduct: OrderProduct
  ): Prisma.OrderProductUncheckedCreateInput {
    return {
      id: orderProduct.id.toString(),
      order_id: orderProduct.order_id.toString(),
      product_id: orderProduct.product_id.toString(),
      offer_product_id: orderProduct.offer_product_id.toString(),
      quantity: orderProduct.quantity,
      created_at: orderProduct.created_at,
      updated_at: orderProduct.updated_at,
    };
  }
}
