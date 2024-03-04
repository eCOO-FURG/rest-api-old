import { Order } from "@/domain/entities/order";
import { OrdersRepository } from "@/domain/repositories/orders-repository";
import { prisma } from "../prisma-service";
import { PrismaOrderMapper } from "../mappers/prisma-order-mapper";
import { Decimal } from "@prisma/client/runtime/library";

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

    await prisma.$transaction(async (ctx) => {
      await ctx.order.create({
        data,
      });

      const productsIds = order.items.map((item) => item.product_id.value);
      const offersIds = order.items.map((item) => item.offer_id.value);

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

      const fields = Object.keys(offerProducts).filter(
        (key) => key !== "id"
      ) as (keyof (typeof offerProducts)[0])[];

      const set = fields
        .map((field) => `"${field}" = data."${field}"`)
        .join(", ");

      const values = offerProducts
        .map((entry) => {
          const values = fields.map((field) => {
            const value = entry[field];
            if (typeof value === "string") {
              return `'${value.replace(/'/g, "''")}'`;
            } else if (value instanceof Date) {
              return `'${value.toISOString()}'`;
            }
            return value;
          });
          return `('${entry.id}', ${values.join(", ")})`;
        })
        .join(", ");

      const sql = `
        UPDATE "offers_products"
        SET ${set}
        FROM (VALUES ${values}) AS data(id, ${fields
        .map((field) => `"${field}"`)
        .join(", ")})
        WHERE "offers_products".id = data.id;
    `;

      await ctx.$executeRawUnsafe(sql);
    });
  }
}
