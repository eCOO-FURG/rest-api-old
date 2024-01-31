import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  SERVER_URL: z.string(),
  ENV: z.enum(["dev", "test", "production"]).default("dev"),
  PORT: z.coerce.number().default(3333),
  POSTGRES_URL: z.string(),
  QDRANT_URL: z.string(),
  JWT_SECRET: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  ECOO_EMAIL: z.string(),
  SESSION_DURATION_IN_DAYS: z.coerce.number(),
  EXPECTED_SIMILARITY_SCORE: z.coerce.number(),
  PAYMENTS_PROCESSOR_API_KEY: z.string(),
});

const devSchema = envSchema.omit({
  PAYMENTS_PROCESSOR_API_KEY: true,
});

const selectedEnv = process.env.ENV;

const _env =
  selectedEnv === "dev"
    ? devSchema.safeParse(process.env)
    : envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables.");
}

export const env = _env.data;
