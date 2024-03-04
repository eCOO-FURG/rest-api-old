import { UUID } from "@/core/entities/uuid";
import { OrderProduct } from "@/domain/entities/order-products";
import {
  Prisma,
  OrderOfferProduct as PrismaOrderProduct,
} from "@prisma/client";

export class PrismaOrderProductMapper {
  static toDomain(raw: PrismaOrderProduct) {
    return OrderProduct.create(
      {
        order_id: new UUID(raw.order_id),
        product_id: new UUID(raw.product_id),
        quantity_or_weight: raw.quantity_or_weight.toNumber(),
        offer_id: new UUID(raw.offer_id),
        created_at: raw.created_at,
        updated_at: raw.created_at,
      },
      new UUID(raw.id)
    );
  }

  static toPrisma(
    orderProduct: OrderProduct
  ): Prisma.OrderOfferProductUncheckedCreateInput {
    return {
      id: orderProduct.id.value,
      order_id: orderProduct.order_id.value,
      product_id: orderProduct.product_id.value,
      offer_id: orderProduct.offer_id.value,
      quantity_or_weight: orderProduct.quantity_or_weight,
      created_at: orderProduct.created_at,
      updated_at: orderProduct.updated_at,
    };
  }
}
