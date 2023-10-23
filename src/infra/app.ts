import fastify from "fastify";
import { env } from "./env";
import { ZodError } from "zod";
import { routes } from "./http/controllers/routes";
import { fastifyAwilixPlugin } from "@fastify/awilix";
import "./container";
import { useCases } from "./container";

export const app = fastify();

app.register(fastifyAwilixPlugin, {
  disposeOnClose: true,
  disposeOnResponse: true,
});

app.addHook("onRequest", (request, _, done) => {
  request.diScope.register(useCases);
  done();
});

app.register(routes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.NODE_ENV !== "production") {
    console.error(error);
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." });
});
