import { Offer } from "@/domain/entities/offer";
import { OffersRepository } from "@/domain/repositories/offers-repository";
import { PrismaOfferMapper } from "../mappers/prisma-offer-mapper";
import { prisma } from "../prisma-service";
import { UUID } from "@/core/entities/uuid";

export class PrismaOffersRepository implements OffersRepository {
  async findManyItemsByProductIdsAndCreatedAtOlderOrEqualThan(
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
  async save(offer: Offer): Promise<void> {
    const data = PrismaOfferMapper.toPrisma(offer);

    await prisma.offer.create({
      data,
    });
  }
}
