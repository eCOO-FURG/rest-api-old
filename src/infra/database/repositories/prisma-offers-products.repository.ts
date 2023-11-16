import { OfferProduct } from "@/domain/entities/offer-product";
import { OffersProductsRepository } from "@/domain/repositories/offers-products-repository";
import { PrismaOfferProductMaper } from "../mappers/prisma-offer-product-mapper";
import { prisma } from "../prisma-service";

export class PrismaOffersProductsRepository
  implements OffersProductsRepository
{
  async findManyByProductsIds(product_ids: string[]): Promise<OfferProduct[]> {
    const offersProducts = await prisma.offerProduct.findMany({
      where: {
        product_id: {
          in: product_ids,
        },
      },
    });

    return offersProducts.map((item) => PrismaOfferProductMaper.toDomain(item));
  }

  async save(offerProduct: OfferProduct): Promise<void> {
    const data = PrismaOfferProductMaper.toPrisma(offerProduct);

    await prisma.offerProduct.create({
      data,
    });
  }
}
