import { Order } from "@/domain/entities/order";
import { OrdersRepository } from "@/domain/repositories/orders-repository";
import { prisma } from "../prisma-service";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { env } from "@/infra/env";
import { ORDER_STATUS } from "@prisma/client";

export class PrismaOrdersRepository implements OrdersRepository {
  async update(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await prisma.order.update({
      data,
      where: {
        id: data.id,
      },
    });
  }

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

  async findByStatus(status: ORDER_STATUS): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: {
        status,
      },
    });

    return orders.map((order) => PrismaOrderMapper.toDomain(order));
  }

  async save(order: Order): Promise<void> {
    if (env.ENV === "dev") {
      order.status = "READY";
    }

    const data = PrismaOrderMapper.toPrisma(order);

    await prisma.order.create({
      data,
    });
  }
}
