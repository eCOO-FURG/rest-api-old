import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OfferProduct } from "@/domain/entities/offer-product";
import { Prisma, OfferProduct as PrismaOfferProduct } from "@prisma/client";

export class PrismaOfferProductMapper {
  static toDomain(raw: PrismaOfferProduct) {
    return OfferProduct.create(
      {
        offer_id: new UniqueEntityID(raw.offer_id),
        product_id: new UniqueEntityID(raw.product_id),
        price: raw.price.toNumber(),
        quantity_or_weight: raw.quantity_or_weight.toNumber(),
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(
    offerProduct: OfferProduct
  ): Prisma.OfferProductUncheckedCreateInput {
    return {
      id: offerProduct.id.toString(),
      price: offerProduct.price,
      quantity_or_weight: offerProduct.quantity_or_weight,
      offer_id: offerProduct.offer_id.toString(),
      product_id: offerProduct.product_id.toString(),
    };
  }
}
