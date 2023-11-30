import "dotenv/config";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { Environment } from "vitest";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function generateDatabaseURL(schema: string) {
  if (!process.env.POSTGRES_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable.");
  }

  const url = new URL(process.env.POSTGRES_URL);

  url.searchParams.set("schema", schema);

  return url.toString();
}

export default <Environment>{
  name: "prisma",
  async setup() {
    const schema = randomUUID();
    const databaseURL = generateDatabaseURL(schema);

    process.env.POSTGRES_URL = databaseURL;
    process.env.SMTP_SERVER = "127.0.0.1";
    process.env.SMTP_HOST = "2525";

    execSync("npx prisma migrate deploy");

    await prisma.account.create({
      data: {
        id: "account-id",
        email: "account@ecoo.com",
        password: await hash("12345678", 8),
        verified_at: new Date(),
      },
    });

    await prisma.person.create({
      data: {
        id: "person-id",
        cpf: "58267172033",
        first_name: "test",
        last_name: "account",
        account_id: "account-id",
      },
    });

    await prisma.session.create({
      data: {
        ip_address: "",
        user_agent: "agent",
        account_id: "account-id",
        created_at: new Date(),
      },
    });

    await prisma.agribusiness.create({
      data: {
        id: "agribusiness-id",
        admin_id: "account-id",
        caf: "caf",
        name: "agribusiness name",
      },
    });

    await prisma.productType.create({
      data: {
        id: "product-type-id",
        name: "product-type",
      },
    });

    await prisma.product.create({
      data: {
        id: "product-id",
        name: "product",
        type_id: "product-type-id",
      },
    });

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          `DROP SCHEMA IF EXISTS "${schema}" CASCADE`
        );

        await prisma.$disconnect();
      },
    };
  },
};
