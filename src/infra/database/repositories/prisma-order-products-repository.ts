import { OrderProduct } from "@/domain/entities/order-products";
import { OrdersProductsRepository } from "@/domain/repositories/orders-products-repository";
import { prisma } from "../prisma-service";
import { PrismaOrderProductMapper } from "../mappers/prisma-order-product.mapper";

export class PrismaOrderProductsRepository implements OrdersProductsRepository {
  async save(orderProducts: OrderProduct[]): Promise<void> {
    const data = orderProducts.map((orderProduct) =>
      PrismaOrderProductMapper.toPrisma(orderProduct)
    );

    await prisma.orderProduct.createMany({
      data,
    });
  }

  async findManyByOrderId(order_id: string): Promise<OrderProduct[]> {
    const data = await prisma.orderProduct.findMany({
      where: {
        order_id,
      },
    });

    const mappedOrderProducts = data.map((orderProduct) =>
      PrismaOrderProductMapper.toDomain(orderProduct)
    );

    return mappedOrderProducts;
  }
}
