import { OfferProduct } from "@/domain/entities/offer-product";
import { OffersProductsRepository } from "@/domain/repositories/offers-products";
import { PrismaOfferProductMaper } from "../mappers/prisma-offer-product-mapper";
import { prisma } from "../prisma-service";

export class PrismaOffersProductsRepository
  implements OffersProductsRepository
{
  async save(offerProduct: OfferProduct): Promise<void> {
    const data = PrismaOfferProductMaper.toPrisma(offerProduct);

    await prisma.offerProduct.create({
      data,
    });
  }
}
