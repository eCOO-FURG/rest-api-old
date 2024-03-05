import { Order } from "@/domain/entities/order";
import { OrdersRepository } from "@/domain/repositories/orders-repository";
import { prisma } from "../prisma-service";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { Decimal } from "@prisma/client/runtime/library";
import { PrismaOrderProductMapper } from "../mappers/prisma-order-product.mapper";
import { updateManyRawQuery } from "../utils/update-many-raw-query";

export class PrismaOrdersRepository implements OrdersRepository {
  async findById(id: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
    });

    if (!order) {
      return null;
    }

    return PrismaOrderMapper.toDomain(order);
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    const items = order.items.map((item) =>
      PrismaOrderProductMapper.toPrisma(item)
    );

    await prisma.$transaction(async (ctx) => {
      await ctx.order.create({
        data,
      });

      const productsIds = items.map((item) => item.product_id);
      const offersIds = items.map((item) => item.offer_id);

      const offerProducts = await prisma.offerProduct.findMany({
        where: {
          product_id: { in: productsIds },
          offer_id: { in: offersIds },
        },
      });

      for (const item of order.items) {
        const index = offerProducts.findIndex(
          (offerProduct) =>
            item.offer_id.equals(offerProduct.offer_id) &&
            item.product_id.equals(offerProduct.product_id)
        );

        const quantity_or_weight = Number(
          offerProducts[index].quantity_or_weight
        );

        offerProducts[index].quantity_or_weight = new Decimal(
          quantity_or_weight - item.quantity_or_weight
        );
      }

      const { sql } = updateManyRawQuery(offerProducts, "offers_products");

      await ctx.$executeRawUnsafe(sql);
    });
  }
}
