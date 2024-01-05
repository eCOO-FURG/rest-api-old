import { Order } from "@/domain/entities/order";
import { OrdersRepository } from "@/domain/repositories/orders-repository";
import { prisma } from "../prisma-service";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";

export class PrismaOrdersRepository implements OrdersRepository {
  async save(order: Order): Promise<void> {
    const data = PrismaOrderMapper.toPrisma(order);

    await prisma.order.create({
      data,
    });
  }
}
