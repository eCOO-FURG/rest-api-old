import { UUID } from "@/core/entities/uuid";
import { Order } from "@/domain/entities/order";
import {
  Order as PrismaOrder,
  OrderOfferProduct as PrismaOrderOfferProduct,
  Product as PrismaProduct,
  Account as PrismaAccount,
  Person as PrismaPerson,
  Prisma,
} from "@prisma/client";
import { PrismaProductMapper } from "./prisma-product-mapper";
import { PrismaUserMapper } from "./prisma-user-mapper";

export class PrismaOrderMapper {
  static toDomain(
    raw: PrismaOrder & {
      customer: PrismaAccount & { person: PrismaPerson };
    } & {
      items?: (Omit<PrismaOrderOfferProduct, "product_id"> & {
        product: PrismaProduct;
      })[];
    }
  ) {
    return Order.create(
      {
        customer: PrismaUserMapper.toDomain(raw.customer),
        payment_method: "PIX",
        shipping_address: raw.shipping_address,
        status: raw.status,
        cycle_id: new UUID(raw.cycle_id),
        price: raw.price.toNumber(),
        items: raw.items?.map((item) => ({
          id: new UUID(item.id),
          offer_id: new UUID(item.offer_id),
          order_id: new UUID(item.order_id),
          product: PrismaProductMapper.toDomain(item.product),
          amount: item.amount,
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
        created_at: raw.created_at,
        updated_at: raw.created_at,
      },
      new UUID(raw.id)
    );
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    const items: Prisma.OrderUncheckedCreateInput["items"] = {
      createMany: {
        data: order.items.map((item) => ({
          offer_id: item.offer_id.value,
          product_id: item.product.id.value,
          amount: item.amount,
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
      },
    };

    return {
      id: order.id.value,
      price: order.price,
      cycle_id: order.cycle_id.value,
      customer_id: order.customer.id.value,
      payment_method: order.payment_method,
      shipping_address: order.shipping_address,
      status: order.status,
      items,
      created_at: order.created_at,
      updated_at: order.updated_at,
    };
  }
}
