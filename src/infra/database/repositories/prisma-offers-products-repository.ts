import { OfferProduct } from "@/domain/entities/offer-product";
import { OffersProductsRepository } from "@/domain/repositories/offers-products-repository";
import { PrismaOfferProductMapper } from "../mappers/prisma-offer-product-mapper";
import { prisma } from "../prisma-service";

export class PrismaOffersProductsRepository
  implements OffersProductsRepository
{
  async save(offerProduct: OfferProduct): Promise<void> {
    const data = PrismaOfferProductMapper.toPrisma(offerProduct);

    await prisma.offerProduct.create({
      data,
    });
  }

  async findManyAvailableByProductsIds(
    product_ids: string[]
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
