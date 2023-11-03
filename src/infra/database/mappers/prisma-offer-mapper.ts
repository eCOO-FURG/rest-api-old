import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Offer } from "@/domain/entities/offer";
import { Prisma, Offer as PrismaOffer } from "@prisma/client";

export class PrismaOfferMapper {
  static toDomain(raw: PrismaOffer) {
    return Offer.create(
      {
        agribusiness_id: new UniqueEntityID(raw.agribusiness_id),
        status: raw.status,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(offer: Offer): Prisma.OfferUncheckedCreateInput {
    return {
      agribusiness_id: offer.agribusiness_id.toString(),
      status: offer.status,
    };
  }
}
