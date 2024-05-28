import { Offer } from "@/domain/entities/offer";
import { OffersRepository } from "@/domain/repositories/offers-repository";
import { PrismaOfferMapper } from "../mappers/prisma-offer-mapper";
import { prisma } from "../prisma-service";
import { UUID } from "@/core/entities/uuid";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";
import { updateManyRawQuery } from "../utils/update-many-raw-query";
import { Decimal } from "@prisma/client/runtime/library";

export class PrismaOffersRepository implements OffersRepository {
  async save(offer: Offer): Promise<void> {
    const data = PrismaOfferMapper.toPrisma(offer);

    await prisma.offer.create({
      data,
    });
  }

  async update(offer: Offer): Promise<void> {
    await prisma.$transaction(async (tsx) => {
      await tsx.offerProduct.deleteMany({
        where: {
          offer_id: offer.id.value,
          product_id: {
            notIn: offer.items.map((item) => item.product.id.value),
          },
        },
      });

      const remainings = await tsx.offerProduct.findMany({
        where: {
          offer_id: offer.id.value,
        },
      });

      const differents = remainings.filter((remaining) => {
        const index = offer.items.findIndex((item) =>
          item.product.id.equals(remaining.product_id)
        );

        const diff =
          remaining.amount !== offer.items[index].amount ||
          remaining.price.toNumber() !==
            new Decimal(offer.items[index].price).toNumber();

        if (diff) {
          remaining.amount = offer.items[index].amount;
          remaining.price = new Decimal(offer.items[index].price);
          return remaining;
        }
      });

      if (differents.length) {
        const { sql } = updateManyRawQuery(differents, "offers_products");

        await tsx.$executeRawUnsafe(sql);
      }

      const remainingsProductsIds = remainings.map((item) => item.product_id);

      const rest = offer.items.filter(
        (item) => !remainingsProductsIds.includes(item.product.id.value)
      );

      await tsx.offerProduct.createMany({
        data: rest.map((item) => ({
          offer_id: item.offer_id.value,
          product_id: item.product.id.value,
          amount: item.amount,
          price: new Decimal(item.price),
          description: item.description,
        })),
      });
    });
  }

  async findManyByOffersIdsAndProductsIds(
    offers_ids: string[],
    products_ids: string[]
  ): Promise<Offer[]> {
    const data = await prisma.offer.findMany({
      where: {
        items: {
          some: {
            AND: {
              offer_id: {
                in: offers_ids,
              },
              product_id: {
                in: products_ids,
              },
            },
          },
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return data.map((item) => PrismaOfferMapper.toDomain(item));
  }

  async findManyItemsByCycleIdProductsIdsAndOfferCreatedAt(
    cycle_id: string,
    product_ids: string[],
    date: Date,
    page = 1
  ): Promise<Offer["items"]> {
    const skip = (page - 1) * 20;

    const data = await prisma.offerProduct.findMany({
      where: {
        product_id: {
          in: product_ids,
        },
        amount: {
          gt: 0,
        },
        offer: {
          cycle_id,
          created_at: {
            gte: date,
          },
        },
      },
      include: {
        product: true,
      },
      skip,
      take: 20,
    });

    const items: Offer["items"] = data.map((item) => ({
      offer_id: new UUID(item.offer_id),
      product: PrismaProductMapper.toDomain(item.product),
      price: item.price.toNumber(),
      amount: item.amount,
      description: item.description,
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return items;
  }

  async findActive(
    agribusiness_id: string,
    cycle_id: string,
    target_date: Date
  ): Promise<Offer | null> {
    const data = await prisma.offer.findFirst({
      where: {
        agribusiness_id,
        cycle_id,
        created_at: {
          gte: target_date,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!data) {
      return null;
    }

    return PrismaOfferMapper.toDomain(data);
  }
}
