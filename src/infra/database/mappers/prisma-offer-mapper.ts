import { UUID } from "@/core/entities/uuid";
import { Offer } from "@/domain/entities/offer";
import {
  OfferProduct as PrismaOfferProduct,
  Prisma,
  Offer as PrismaOffer,
  Product as PrismaProduct,
} from "@prisma/client";
import { PrismaProductMapper } from "./prisma-product-mapper";

export class PrismaOfferMapper {
  static toDomain(
    raw: PrismaOffer & {
      items: (Omit<PrismaOfferProduct, "product_id"> & {
        product: PrismaProduct;
      })[];
    }
  ) {
    return Offer.create(
      {
        agribusiness_id: new UUID(raw.agribusiness_id),
        cycle_id: new UUID(raw.cycle_id),
        items: raw.items.map((item) => ({
          id: new UUID(item.id),
          offer_id: new UUID(item.offer_id),
          product: PrismaProductMapper.toDomain(item.product),
          price: item.price.toNumber(),
          description: item.description,
          amount: item.amount,
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
    return {
      id: offer.id.value,
      cycle_id: offer.cycle_id.value,
      agribusiness_id: offer.agribusiness_id.value,
      items: {
        createMany: {
          data: offer.items.map((item) => ({
            price: item.price,
            product_id: item.product.id.value,
            description: item.description,
            amount: item.amount,
            created_at: item.created_at,
            updated_at: item.updated_at,
          })),
        },
      },
      created_at: offer.created_at,
      updated_at: offer.updated_at,
    };
  }
}
