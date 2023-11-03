import { Offer } from "@/domain/entities/offer";
import { OffersRepository } from "@/domain/repositories/offers-repository";
import { PrismaOfferMapper } from "../mappers/prisma-offer-mapper";
import { prisma } from "../prisma-service";

export class PrismaOffersRepository implements OffersRepository {
  async save(offer: Offer): Promise<void> {
    const data = PrismaOfferMapper.toPrisma(offer);

    await prisma.offer.create({
      data,
    });
  }
}
