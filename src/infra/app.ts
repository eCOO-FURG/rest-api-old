import "@/infra/container/";
import "@/infra/log/sentry";

import * as Sentry from "@sentry/node";

import fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import cors from "@fastify/cors";

import { env } from "./env";
import { ZodError } from "zod";
import { routes } from "./http/controllers/routes";
import { fastifyAwilixPlugin } from "@fastify/awilix";
import { FastifySwaggerOptions } from "./helpers/swagger";

export const app = fastify();

app.register(cors, {
  origin: true, //Todas as URLs de front-end podem acessar nosso back-end
});

app.register(fastifyAwilixPlugin, {
  asyncInit: true,
});

app.register(routes);

app.register(swagger, FastifySwaggerOptions);
app.register(swaggerUI, {
  prefix: "/docs",
});

Sentry.setupFastifyErrorHandler(app);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    const issues = error.issues.map((issue) => ({
      property: issue.path[0],
      reason: issue.message,
    }));

    return reply.status(400).send({ message: "Erro de validação.", issues });
  }

  if (["prod", "staging"].includes(env.ENV)) {
    Sentry.captureException(error);
  } else {
    console.log(error);
  }

  return reply.status(500).send({ message: "⚠️ Internal server error." });
});
