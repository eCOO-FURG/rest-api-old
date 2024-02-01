import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Product } from "@/domain/entities/product";
import { Prisma, Product as PrismaProduct } from "@prisma/client";

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct) {
    return Product.create(
      {
        name: raw.name,
        image: raw.image,
        pricing: "WEIGHT",
        type_id: new UniqueEntityID(raw.type_id),
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      pricing: product.pricing,
      name: product.name,
      image: product.image,
      type_id: product.type_id.toString(),
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }
}
