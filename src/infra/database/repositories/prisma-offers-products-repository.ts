import { OfferProduct } from "@/domain/entities/offer-product";
import { OffersProductsRepository } from "@/domain/repositories/offers-products-repository";
import { PrismaOfferProductMapper } from "../mappers/prisma-offer-product-mapper";
import { prisma } from "../prisma-service";
import { Offer } from "@/domain/entities/offer";

export class PrismaOffersProductsRepository
  implements OffersProductsRepository
{
  async save(offerProducts: OfferProduct[]): Promise<void> {
    const data = offerProducts.map((offerProduct) =>
      PrismaOfferProductMapper.toPrisma(offerProduct)
    );

    await prisma.offerProduct.createMany({
      data,
    });
  }

  async findManyWithRemainingQuantityByProductsIdsAndStatus(
    product_ids: string[],
    status: Offer["status"]
  ): Promise<OfferProduct[]> {
    const data = await prisma.offerProduct.findMany({
      where: {
        product_id: {
          in: product_ids,
        },
        quantity: {
          gt: 0,
        },
        offer: {
          status,
        },
      },
    });

    const mappedOffersProducts = data.map((offerProduct) =>
      PrismaOfferProductMapper.toDomain(offerProduct)
    );

    return mappedOffersProducts;
  }

  async update(offerProducts: OfferProduct[]): Promise<void> {
    const data = offerProducts.map((offerProduct) =>
      PrismaOfferProductMapper.toPrisma(offerProduct)
    );

    const fields = Object.keys(data[0]).filter(
      (key) => key !== "id"
    ) as (keyof (typeof data)[0])[];

    const set = fields
      .map((field) => `"${field}" = data."${field}"`)
      .join(", ");

    const values = data
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

    await prisma.$executeRawUnsafe(sql);
  }

  async findManyByIds(ids: string[]): Promise<OfferProduct[]> {
    const data = await prisma.offerProduct.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    const mappedOffersProducts = data.map((offerProduct) =>
      PrismaOfferProductMapper.toDomain(offerProduct)
    );

    return mappedOffersProducts;
  }
}
