import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seeds/seed-users";
import { seedProducts } from "./seeds/seed-products";

const prisma = new PrismaClient();

async function seed() {
  await Promise.all([seedUsers(), seedProducts()]);
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
