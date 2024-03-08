import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seeds/seed-users";
import { seedProducts } from "./seeds/seed-products";
import { seedOffers } from "./seeds/seed-offers";
import { env } from "../src/infra/env";
import { seedSchedules } from "./seeds/seed-schedules";

const prisma = new PrismaClient();

async function seed() {
  await Promise.all([seedUsers(), seedProducts()]);

  switch (env.ENV) {
    case "dev":
      await seedOffers();
      await seedSchedules();
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
