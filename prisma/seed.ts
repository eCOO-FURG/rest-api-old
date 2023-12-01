import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seeds/seed-users";
import { seedProducts } from "./seeds/seed-products";
import { seedOffers } from "./seeds/seed-offers";

const prisma = new PrismaClient();

async function seed() {
  await Promise.all([seedUsers(), seedProducts()]);

  switch (process.env.ENV) {
    case "dev":
      break;
    case "test":
      await seedOffers();
    case "production":
      break;
    default:
      console.log('"ENV" must be provided on .env.');
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
