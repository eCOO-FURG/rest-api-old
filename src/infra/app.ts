import "./container/";
import fastify from "fastify";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import { env } from "./env";
import { ZodError } from "zod";
import { routes } from "./http/controllers/routes";
import { fastifyAwilixPlugin } from "@fastify/awilix";
import { FastifySwaggerOptions } from "./helpers/swagger";
import cors from '@fastify/cors'

export const app = fastify();

app.register(cors, { 
  origin: true, //Todas as URLs de front-end podem acessar nosso back-end
})

app.register(fastifyAwilixPlugin, {
  asyncInit: true,
});

app.register(routes);
app.register(swagger, FastifySwaggerOptions);
app.register(swaggerUI, {
  prefix: "/docs",
});

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.ENV !== "prod") {
    console.error(error);
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "⚠️ Internal server error." });
});
