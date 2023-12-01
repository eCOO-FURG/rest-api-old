import { Product } from "@/domain/entities/product";
import { ProductsRepository } from "@/domain/repositories/products-repository";
import { PrismaProductMapper } from "../mappers/prisma-product-mapper";
import { prisma } from "../prisma-service";

export class PrismaProductsRepository implements ProductsRepository {
  async save(product: Product): Promise<void> {
    const data = PrismaProductMapper.toPrisma(product);

    await prisma.product.create({
      data,
    });
  }

  async findById(id: string): Promise<Product | null> {
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!product) {
      return null;
    }

    return PrismaProductMapper.toDomain(product);
  }

  async findByName(name: string): Promise<Product | null> {
    const product = await prisma.product.findFirst({
      where: {
        name,
      },
    });

    if (!product) {
      return null;
    }

    return PrismaProductMapper.toDomain(product);
  }

  async findManyByName(names: string[]): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: {
        name: {
          in: names,
        },
      },
    });

    const mappedProducts = products.map((product) =>
      PrismaProductMapper.toDomain(product)
    );

    return mappedProducts;
  }
}
