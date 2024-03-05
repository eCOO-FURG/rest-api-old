import { prisma } from "../../src/infra/database/prisma-service";
import { accountId } from "./seed-users";

export async function seedOffers() {
  await prisma.agribusiness.deleteMany();

  const products = await prisma.product.findMany();

  await prisma.agribusiness.create({
    data: {
      caf: "471241087",
      name: "Agronegócio do Kwecko",
      admin_id: accountId,
      offers: {
        create: {
          items: {
            create: products.map((product) => ({
              product_id: product.id,
              price: "10",
              quantity_or_weight:
                product.pricing === "UNIT"
                  ? Math.floor(Math.random() * 20 + 1)
                  : Math.floor(Math.random() * 20 + 1) * 50,
            })),
          },
        },
      },
    },
  });
}
