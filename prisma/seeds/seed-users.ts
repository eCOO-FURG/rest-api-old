import { randomUUID } from "crypto";
import { prisma } from "../../src/infra/database/prisma-service";
import { hash } from "bcryptjs";

export const accountId = randomUUID();

export async function seedUsers() {
  await prisma.account.deleteMany();

  await prisma.account.create({
    data: {
      id: accountId,
      email: "admin@ecoo.com.br",
      password: await hash("12345678", 8),
      verified_at: new Date(),
      person: {
        create: {
          first_name: "Admin",
          last_name: "Account",
          cpf: "58267172033",
        },
      },
    },
  });
}
