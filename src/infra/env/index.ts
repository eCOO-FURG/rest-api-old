import "dotenv/config";
import { z } from "zod";

const deployValidationSchema = z.object({
  ENV: z.enum(["dev", "test", "homolog", "prod"]),
  SERVER_URL: z.string().min(1),
  PORT: z.coerce.number().default(3333),
  POSTGRES_URL: z.string().min(1),
  QDRANT_URL: z.string().min(1),
  NLP_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z.coerce.number().min(1),
  ECOO_EMAIL: z.string().min(1),
  ECOO_EMAIL_PASSWORD: z.string().min(1),
  SESSION_DURATION_IN_DAYS: z.coerce.number().min(1),
  EXPECTED_SIMILARITY_SCORE: z.coerce.number(),
});

const devValidationSchema = deployValidationSchema.omit({
  ECOO_EMAIL_PASSWORD: true,
});

const testValidationSchema = devValidationSchema.omit({
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
    ? devValidationSchema
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
