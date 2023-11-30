import { prisma } from "../../src/infra/database/prisma-service";
import { hash } from "bcryptjs";

export async function seedUsers() {
  await prisma.person.deleteMany();
  await prisma.account.deleteMany();

  const account = await prisma.account.create({
    data: {
      id: "test-account",
      email: "admin@ecoo.com.br",
      password: await hash("12345678", 8),
      verified_at: new Date(),
    },
  });

  await prisma.person.create({
    data: {
      account_id: account.id,
      first_name: "Admin",
      last_name: "Account",
      cpf: "58267172033",
    },
  });
}
