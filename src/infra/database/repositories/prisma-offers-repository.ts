import { Offer } from "@/domain/entities/offer";
import { OffersRepository } from "@/domain/repositories/offers-repository";
import { PrismaOfferMapper } from "../mappers/prisma-offer-mapper";
import { prisma } from "../prisma-service";
import { OfferProduct } from "@/domain/entities/offer-product";
import { PrismaOfferProductMapper } from "../mappers/prisma-offer-product-mapper";

export class PrismaOffersRepository implements OffersRepository {
  async save(offer: Offer): Promise<void> {
    const data = PrismaOfferMapper.toPrisma(offer);

    await prisma.offer.create({
      data,
    });
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
        offer: {
          status: "AVAILABLE",
        },
      },
    });

    const mappedOffersProducts = data.map((offerProduct) =>
      PrismaOfferProductMapper.toDomain(offerProduct)
    );

    return mappedOffersProducts;
  }
}
