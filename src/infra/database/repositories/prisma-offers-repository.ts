import { Offer } from "@/domain/entities/offer";
import { OffersRepository } from "@/domain/repositories/offers-repository";
import { PrismaOfferMapper } from "../mappers/prisma-offer-mapper";
import { prisma } from "../prisma-service";
import { UUID } from "@/core/entities/uuid";

export class PrismaOffersRepository implements OffersRepository {
  async save(offer: Offer): Promise<void> {
    const data = PrismaOfferMapper.toPrisma(offer);

    await prisma.offer.create({
      data,
    });
  }

  async updateItem(item: Offer["items"][0]): Promise<void> {
    await prisma.offerProduct.update({
      where: {
        id: item.id.value,
      },
      data: {
        price: item.price,
        quantity_or_weight: item.quantity_or_weight,
      },
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
        items: true,
      },
    });

    return data.map((item) => PrismaOfferMapper.toDomain(item));
  }

  async saveItem(item: Offer["items"][0]): Promise<void> {
    await prisma.offerProduct.create({
      data: {
        offer_id: item.offer_id.value,
        price: item.price,
        quantity_or_weight: item.quantity_or_weight,
        product_id: item.product_id.value,
      },
    });
  }

  async findManyItemsByCycleIdProductsIdsAndOfferCreatedAt(
    cycle_id: string,
    product_ids: string[],
    date: Date
  ): Promise<Offer["items"]> {
    const data = await prisma.offerProduct.findMany({
      where: {
        product_id: {
          in: product_ids,
        },
        quantity_or_weight: {
          gt: 0,
        },
        offer: {
          cycle_id,
          created_at: {
            gte: date,
          },
        },
      },
    });

    const mappedOffersProducts: Offer["items"] = data.map((item) => ({
      id: new UUID(item.id),
      offer_id: new UUID(item.offer_id),
      product_id: new UUID(item.product_id),
      price: item.price.toNumber(),
      quantity_or_weight: item.quantity_or_weight.toNumber(),
      created_at: item.created_at,
      updated_at: item.updated_at,
    }));

    return mappedOffersProducts;
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
        items: true,
      },
    });

    if (!data) {
      return null;
    }

    return PrismaOfferMapper.toDomain(data);
  }
}
