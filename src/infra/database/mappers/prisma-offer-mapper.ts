import { UUID } from "@/core/entities/uuid";
import { Offer } from "@/domain/entities/offer";
import { OfferProduct, Prisma, Offer as PrismaOffer } from "@prisma/client";

export class PrismaOfferMapper {
  static toDomain(raw: PrismaOffer & { items?: OfferProduct[] }) {
    return Offer.create(
      {
        agribusiness_id: new UUID(raw.agribusiness_id),
        items: raw.items?.map((item) => ({
          id: new UUID(item.id),
          offer_id: new UUID(item.offer_id),
          product_id: new UUID(item.product_id),
          price: item.price.toNumber(),
          quantity_or_weight: item.quantity_or_weight.toNumber(),
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UUID(raw.id)
    );
  }

  static toPrisma(offer: Offer): Prisma.OfferUncheckedCreateInput {
    const items: Prisma.OfferUncheckedCreateInput["items"] = {
      createMany: {
        data: offer.items.map((item) => ({
          id: item.id.value,
          price: item.price,
          product_id: item.product_id.value,
          quantity_or_weight: item.quantity_or_weight,
          created_at: item.created_at,
          updated_at: item.updated_at,
        })),
      },
    };

    return {
      id: offer.id.value,
      agribusiness_id: offer.agribusiness_id.value,
      items: items,
      created_at: offer.created_at,
      updated_at: offer.updated_at,
    };
  }
}
