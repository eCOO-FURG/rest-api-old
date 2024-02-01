import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seeds/seed-users";
import { seedProducts } from "./seeds/seed-products";
import { seedOffers } from "./seeds/seed-offers";
import { env } from "@/infra/env";

const prisma = new PrismaClient();

async function seed() {
  await Promise.all([seedUsers(), seedProducts()]);

  switch (env.ENV) {
    case "dev":
      await seedOffers();
    case "homolog":
      await seedOffers();
    case "prod":
      break;
  }
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (error) => {
    console.error(error);

    await prisma.$disconnect();

    process.exit(1);
  });
