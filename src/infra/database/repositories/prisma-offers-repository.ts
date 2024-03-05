import { Offer } from "@/domain/entities/offer";
import { OffersRepository } from "@/domain/repositories/offers-repository";
import { PrismaOfferMapper } from "../mappers/prisma-offer-mapper";
import { prisma } from "../prisma-service";
import { OfferProduct } from "@/domain/entities/offer-product";
import { PrismaOfferProductMapper } from "../mappers/prisma-offer-product-mapper";

export class PrismaOffersRepository implements OffersRepository {
  async save(offer: Offer): Promise<void> {
    const data = PrismaOfferMapper.toPrisma(offer);

    const items = offer.items.map((item) =>
      PrismaOfferProductMapper.toPrisma(item)
    );

    await prisma.$transaction(async (ctx) => [
      await ctx.offer.create({
        data,
      }),
      await ctx.offerProduct.createMany({
        data: items,
      }),
    ]);
  }

  async findManyItemsByProductIds(
    product_ids: string[]
  ): Promise<OfferProduct[]> {
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

    const mappedOffersProducts = data.map((offerProduct) =>
      PrismaOfferProductMapper.toDomain(offerProduct)
    );

    return mappedOffersProducts;
  }
}
