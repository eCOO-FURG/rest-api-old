import { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import { registerBodySchema } from "../http/controllers/register";
import { authenticateBodySchema } from "../http/controllers/authenticate";
import { refreshBodySchema } from "../http/controllers/refresh";
import { registerAgribusinessBodySchema } from "../http/controllers/register-agribusiness";
import { offerProductsBodySchema } from "../http/controllers/offer-products";
import { vefiryQuerySchema } from "../http/controllers/verify";

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
          tags: ["POST routes"],
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
      "/sessions": {
        post: {
          tags: ["POST routes"],
          description: "Route for authenticating an user.",
          responses: {
            200: {
              description: "Account authenticated successfully.",
            },
            400: {
              description: "A Body schema validation error ocurred.",
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
                properties: authenticateBodySchema.shape,
              },
            },
          ],
        },
      },
      "/sessions/refresh": {
        post: {
          tags: ["POST routes"],
          description: "Route to refreshing an session.",
          responses: {
            200: {
              description: "Session refreshed successfully.",
            },
            400: {
              description: "Session has expired.",
            },
          },
          parameters: [
            {
              name: "session",
              in: "header",
              description: "access token",
              type: "string",
              schema: {
                type: "string",
                properties: refreshBodySchema.shape,
              },
            },
          ],
        },
      },
      "/agribusinesses": {
        post: {
          tags: ["POST routes"],
          description: "Route to register an agribusiness.",
          responses: {
            201: {
              description: "Agribusiness registered successfully.",
            },
            409: {
              description: "Agribusiness already exists.",
            },
            401: {
              description: "Not logged in",
            },
          },
          parameters: [
            {
              name: "agribusiness",
              in: "body",
              description: "agribusiness object",
              type: "object",
              schema: {
                type: "object",
                properties: registerAgribusinessBodySchema.shape,
              },
            },
          ],
        },
      },
      "/offers": {
        post: {
          tags: ["POST routes"],
          description: "Route to offer products.",
          responses: {
            201: {
              description: "Products successfully offered.",
            },
            409: {
              description: "Products not found.",
            },
            401: {
              description: "Not logged in",
            },
          },
          parameters: [
            {
              name: "offer",
              in: "body",
              description: "offer object",
              type: "object",
              schema: {
                type: "object",
                properties: offerProductsBodySchema.shape,
              },
            },
          ],
        },
        get: {
          tags: ["GET routes"],
          description: "Route to search offers.",
          responses: {
            200: {
              description: "Products found sucessfully.",
            },
            404: {
              description: "Products not found.",
            },
          },
          parameters: [
            {
              name: "product",
              in: "query",
              description: "Product name",
              type: "string",
            },
          ],
        },
      },
      "/me": {
        get: {
          tags: ["GET routes"],
          description: "Route to view user profile.",
          responses: {
            200: {
              description: "Account found successfully.",
            },
            404: {
              description: "Resource not found.",
            },
            401: {
              description: "Not logged in",
            },
          },
        },
      },
      "/verify": {
        get: {
          tags: ["GET routes"],
          description: "Route to verify an accout.",
          responses: {
            200: {
              description: "Account verified sucessfully.",
            },
            404: {
              description: "Account already verified.",
            },
          },
          parameters: [
            {
              name: "code",
              in: "query",
              description: "user code",
              type: "string",
              schema: {
                type: "string",
                properties: vefiryQuerySchema.shape,
              },
            },
          ],
        },
      },
    },
  },
};
