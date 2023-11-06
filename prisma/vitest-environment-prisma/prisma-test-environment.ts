import "dotenv/config";
import { randomUUID } from "node:crypto";
import { execSync } from "node:child_process";
import { Environment } from "vitest";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error("Please provide a DATABASE_URL environment variable.");
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set("schema", schema);

  return url.toString();
}

export default <Environment>{
  name: "prisma",
  async setup() {
    const schema = randomUUID();
    const databaseURL = generateDatabaseURL(schema);

    process.env.DATABASE_URL = databaseURL;

    execSync("npx prisma migrate deploy");

    await prisma.account.create({
      data: {
        id: "fake-account-id",
        email: "test-account@example.com",
        password: await hash("12345678", 8),
        verified_at: new Date(),
      },
    });

    await prisma.person.create({
      data: {
        id: "fake-person-id",
        cpf: "58267172033",
        first_name: "test",
        last_name: "account",
        account_id: "fake-account-id",
      },
    });

    await prisma.session.create({
      data: {
        ip_address: "",
        user_agent: "agent",
        account_id: "fake-account-id",
        created_at: new Date(),
      },
    });

    await prisma.agribusiness.create({
      data: {
        id: "fake-agribusiness-id",
        admin_id: "fake-account-id",
        caf: "fake-caf",
        name: "agribusiness",
      },
    });

    await prisma.product.create({
      data: {
        id: "fake-product-id",
        name: "product",
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
