import { UniqueEntityID } from "@/core/entities/value-objects/unique-entity-id";
import { Product } from "@/domain/entities/product";
import { Prisma, Product as PrismaProduct } from "@prisma/client";

export class PrismaProductMapper {
  static toDomain(raw: PrismaProduct) {
    return Product.create(
      {
        name: raw.name,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      new UniqueEntityID(raw.id)
    );
  }

  static toPrisma(product: Product): Prisma.ProductUncheckedCreateInput {
    return {
      id: product.id.toString(),
      name: product.name,
      created_at: product.created_at,
      updated_at: product.updated_at,
    };
  }
}
