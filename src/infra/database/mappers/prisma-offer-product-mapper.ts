import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { OfferProduct } from "@/domain/entities/offer-product";
import { Prisma, OfferProduct as PrismaOfferProduct } from "@prisma/client";

export class PrismaOfferProductMaper {
  static toDomain(raw: PrismaOfferProduct) {
    return OfferProduct.create(
      {
        offer_id: new UniqueEntityID(raw.offer_id),
        product_id: new UniqueEntityID(raw.product_id),
        amount: raw.amount,
        quantity: raw.quantity,
        weight: raw.weight,
        status: raw.status,
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
      amount: offerProduct.amount,
      quantity: offerProduct.quantity,
      weight: offerProduct.weight,
      status: offerProduct.status,
      offer_id: offerProduct.offer_id.toString(),
      product_id: offerProduct.product_id.toString(),
    };
  }
}
