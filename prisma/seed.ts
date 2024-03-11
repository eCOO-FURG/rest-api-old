import { PrismaClient } from "@prisma/client";
import { seedUsers } from "./seeds/seed-users";
import { seedProducts } from "./seeds/seed-products";
import { seedCycles } from "./seeds/seed-cycles";

const prisma = new PrismaClient();

async function seed() {
  await Promise.all([seedUsers(), seedProducts()]);
  await seedCycles();
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
