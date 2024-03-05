import { UUID } from "@/core/entities/uuid";
import { Offer } from "@/domain/entities/offer";
import { Prisma, Offer as PrismaOffer } from "@prisma/client";

export class PrismaOfferMapper {
  static toDomain(raw: PrismaOffer) {
    return Offer.create(
      {
        agribusiness_id: new UUID(raw.agribusiness_id),
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UUID(raw.id)
    );
  }

  static toPrisma(offer: Offer): Prisma.OfferUncheckedCreateInput {
    return {
      id: offer.id.value,
      agribusiness_id: offer.agribusiness_id.value,
      created_at: offer.created_at,
      updated_at: offer.updated_at,
    };
  }
}
