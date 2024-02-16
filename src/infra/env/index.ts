import "dotenv/config";
import { z } from "zod";

const deployValidationSchema = z.object({
  ENV: z.enum(["dev", "test", "homolog", "prod"]),
  SERVER_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  POSTGRES_URL: z.string(),
  QDRANT_URL: z.string(),
  NLP_URL: z.string(),
  JWT_SECRET: z.string(),
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  ECOO_EMAIL: z.string(),
  SESSION_DURATION_IN_DAYS: z.coerce.number(),
  EXPECTED_SIMILARITY_SCORE: z.coerce.number(),
  PAYMENTS_PROCESSOR_API_KEY: z.string(),
});

const localValidationSchema = deployValidationSchema.omit({
  PAYMENTS_PROCESSOR_API_KEY: true,
});

const testValidationSchema = localValidationSchema.omit({
  SMTP_HOST: true,
  SMTP_PORT: true,
  QDRANT_URL: true,
  POSTGRES_URL: true,
  JWT_SECRET: true,
  EXPECTED_SIMILARITY_SCORE: true,
  NLP_URL: true,
});

const environment = process.env.ENV;

if (!environment) {
  throw new Error(
    "❌ Invalid environment variables: Please specify the environment!"
  );
}

const validationSchema =
  environment === "dev"
    ? localValidationSchema
    : environment === "test"
    ? testValidationSchema
    : deployValidationSchema;

const _env = validationSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables.");
}

export const env = {
  ..._env.data,
} as z.infer<typeof deployValidationSchema>;
