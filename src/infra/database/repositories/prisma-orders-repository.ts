import { Order } from "@/domain/entities/order";
import { OrdersRepository } from "@/domain/repositories/orders-repository";
import { prisma } from "../prisma-service";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { Decimal } from "@prisma/client/runtime/library";
import { updateManyRawQuery } from "../utils/update-many-raw-query";

export class PrismaOrdersRepository implements OrdersRepository {
  async findById(id: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return null;
    }

    return PrismaOrderMapper.toDomain(order);
  }

  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await prisma.$transaction(async (tsx) => {
      await tsx.order.create({
        data,
      });

      const productsIds = order.items.map((item) => item.product_id.value);
      const offersIds = order.items.map((item) => item.offer_id.value);

      const offers = await tsx.offerProduct.findMany({
        where: {
          product_id: { in: productsIds },
          offer_id: { in: offersIds },
        },
      });

      for (const item of order.items) {
        const index = offers.findIndex(
          (offer) =>
            item.offer_id.equals(offer.offer_id) &&
            item.product_id.equals(offer.product_id)
        );

        const quantity_or_weight = Number(offers[index].quantity_or_weight);

        offers[index].quantity_or_weight = new Decimal(
          quantity_or_weight - item.quantity_or_weight
        );
      }

      const { sql } = updateManyRawQuery(offers, "offers_products");

      await tsx.$executeRawUnsafe(sql);
    });
  }

  async findManyByCycleIdAndPage(
    cycle_id: string,
    page: number
  ): Promise<Order[]> {
    const skip = (page - 1) * 20;

    const orders = await prisma.order.findMany({
      where: {
        cycle_id,
      },
      skip,
      take: 20,
    });

    const mappedOrders = orders.map((item) => PrismaOrderMapper.toDomain(item));

    return mappedOrders;
  }
}
