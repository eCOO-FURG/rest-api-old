import { PrismaClient } from "@prisma/client";
import { env } from "../env";

export const prisma = new PrismaClient({
  log: env.ENV === "dev" ? ["query"] : [],
});
