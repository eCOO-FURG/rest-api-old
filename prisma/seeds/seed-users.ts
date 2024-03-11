import { randomUUID } from "crypto";
import { prisma } from "../../src/infra/database/prisma-service";
import { hash } from "bcryptjs";
import { env } from "../../src/infra/env";

export async function seedUsers() {
  await prisma.account.deleteMany();

  await prisma.account.create({
    data: {
      id: randomUUID(),
      email: env.ECOO_EMAIL ?? "suporte@ecoo.org.br",
      cellphone: "99999999999",
      password: env.ECOO_EMAIL_PASSWORD
        ? await hash(env.ECOO_EMAIL_PASSWORD, 8)
        : await hash("12345678", 8),
      verified_at: new Date(),
      person: {
        create: {
          first_name: "Administador",
          last_name: "CDD",
          cpf: "00000000000",
        },
      },
    },
  });
}
