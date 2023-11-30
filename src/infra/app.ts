import "@tensorflow/tfjs-node";
import fastify from "fastify";
import { env } from "./env";
import { ZodError } from "zod";
import { routes } from "./http/controllers/routes";
import { fastifyAwilixPlugin } from "@fastify/awilix";
import "./container/";

export const app = fastify();

app
  .register(fastifyAwilixPlugin, {
    asyncInit: true,
  })
  .then(() => {
    app.register(routes);
  });

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: "Validation error.", issues: error.format() });
  }

  if (env.ENV !== "production") {
    console.error(error);
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: "Internal server error." });
});
