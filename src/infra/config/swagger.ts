import { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import { registerBodySchema } from "../http/controllers/register";

export const FastifySwaggerOptions: FastifyDynamicSwaggerOptions = {
  swagger: {
    swagger: "2.0",
    info: {
      title: "eCOO Rest-API",
      description: "Fastify ecOO API docs with Swagger.",
      version: "0.1.0",
    },
    externalDocs: {
      url: "https://github.com/eCOO-FURG/rest-api",
      description: "Access the repository here.",
    },
    paths: {
      "/users": {
        post: {
          description: "Route for creating an user.",
          responses: {
            201: {
              description: "Successfully created a new account.",
            },
            400: {
              description: "A Body schema validation error ocurred.",
            },
            401: {
              description: "An account with the provided email already exists.",
            },
          },
          parameters: [
            {
              name: "user",
              in: "body",
              description: "user object",
              type: "object",
              schema: {
                type: "object",
                properties: registerBodySchema.shape,
              },
            },
          ],
        },
      },
    },
  },
};
