import { PRICING } from "@prisma/client";

import { prisma } from "../../src/infra/database/prisma-service";

import productsCategories from "../../products.json";

export async function seedProducts() {
  await prisma.productType.deleteMany();

  for (const category of productsCategories) {
    await prisma.productType.create({
      data: {
        name: category.name,
        products: {
          create: category.items?.map((item) => ({
            name: item.name,
            pricing: item.pricing as PRICING,
            image: item.image,
          })),
        },
      },
    });
  }
}
