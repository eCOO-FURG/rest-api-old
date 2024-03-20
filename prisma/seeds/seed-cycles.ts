import { PrismaCycleMapper } from "../../src/infra/database/mappers/prisma-cycle-mapper";
import { Cycle } from "../../src/domain/entities/cycle";
import { env } from "../../src/infra/env";
import { prisma } from "../../src/infra/database/prisma-service";

export async function seedCycles() {
  await prisma.cycle.deleteMany();

  if (env.ENV === "prod" || env.ENV === "homolog") {
    const weekly = Cycle.create({
      alias: "Semanal",
      duration: 7,
      offering: [1, 7],
      ordering: [2, 3, 4],
      dispatching: [5, 6],
    });

    // const everyThursday = Cycle.create({
    //   alias: "Quintas-feiras",
    //   duration: 1,
    //   offering: [5],
    //   ordering: [5],
    //   dispatching: [5],
    // });

    const cycles = [
      weekly,
      // everyThursday
    ];

    const prismaCycles = cycles.map((item) => PrismaCycleMapper.toPrisma(item));

    for (let prismaCycle of prismaCycles) {
      await prisma.cycle.create({
        data: prismaCycle,
      });
    }
  }

  if (env.ENV === "dev") {
    const everyDay = [];

    for (let i = 1; i <= 7; i++) {
      everyDay.push(i);
    }

    const cycle = Cycle.create({
      alias: "Semanal",
      duration: 7,
      offering: everyDay,
      ordering: everyDay,
      dispatching: everyDay,
    });

    const prismaCycle = PrismaCycleMapper.toPrisma(cycle);

    await prisma.cycle.create({
      data: prismaCycle,
    });

    const account = await prisma.account.findUnique({
      where: {
        email: env.ECOO_EMAIL ?? "suporte@ecoo.org.br",
      },
    });

    const products = await prisma.product.findMany();

    await prisma.agribusiness.create({
      data: {
        caf: "471241087",
        name: "Agronegócio do CDD",
        admin_id: account!.id,
        offers: {
          create: {
            cycle_id: cycle.id.value,
            items: {
              create: products.map((product) => ({
                product_id: product.id,
                price: "10",
                amount:
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
}
