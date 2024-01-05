import { OrderProduct } from "@/domain/entities/order-products";
import { OrdersProductsRepository } from "@/domain/repositories/orders-products-repository";
import { prisma } from "../prisma-service";
import { PrismaOrderProductMapper } from "../mappers/prisma-order-product.mapper";

export class PrismaOrderProductsRepository implements OrdersProductsRepository {
  async save(orderProduct: OrderProduct): Promise<void> {
    const data = PrismaOrderProductMapper.toPrisma(orderProduct);

    await prisma.orderProduct.create({
      data,
    });
  }
}
