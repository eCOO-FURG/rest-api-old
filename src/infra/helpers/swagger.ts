import { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import { registerBodySchema } from "../http/controllers/register";
import { authenticateBodySchema } from "../http/controllers/authenticate-with-password";
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
          tags: ["USER"],
          description:
            "Route for creating an user. It does not return any information.",
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
                example: {
                  email: "john@email.com",
                  password: "12345678",
                  first_name: "John",
                  last_name: "Doe",
                  cpf: "523.065.281-01",
                },
              },
            },
          ],
        },
      },
      "/sessions": {
        post: {
          tags: ["USER"],
          description:
            "Route for authenticating an user. It returns an encrypted access token used to access other application routes.",
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
              description: "Authentication object",
              type: "object",
              schema: {
                type: "object",
                properties: authenticateBodySchema.shape,
                example: {
                  email: "john@email.com",
                  password: "12345678",
                },
              },
            },
          ],
        },
      },
      "/sessions/refresh": {
        post: {
          tags: ["USER"],
          description:
            "Route to refreshing an session. It returns a new valid access token and create a new session for the user.",
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
          tags: ["AGRIBUSINESS"],
          description: "Route to register an agribusiness. It has no return.",
          responses: {
            201: {
              description: "Agribusiness registered successfully.",
            },
            409: {
              description: "Agribusiness already exists.",
            },
            401: {
              description: "Not logged in.",
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
                example: {
                  caf: "UF000000.00.000000000CAF",
                  name: "Agribusiness name",
                },
              },
            },
          ],
        },
      },
      "/offers": {
        post: {
          tags: ["OFFERS"],
          description: "Route to offer products. It has no return.",
          responses: {
            201: {
              description: "Products successfully offered.",
            },
            409: {
              description: "Products not found.",
            },
            401: {
              description: "Not logged in.",
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
                example: {
                  products: [
                    {
                      product_id: "123",
                      weight: "1 kg",
                      quantity: "10",
                      amount: "50.00",
                    },
                    {
                      product_id: "456",
                      weight: "0.5 kg",
                      quantity: "5",
                      amount: "25.00",
                    },
                  ],
                },
              },
            },
          ],
        },
        get: {
          tags: ["OFFERS"],
          description:
            "Route to search offers. It returns a list with the semantic similar orders found.",
          responses: {
            200: {
              description: "Offers found sucessfully.",
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
          tags: ["USER"],
          description: "Route to view user profile.",
          responses: {
            200: {
              description: "Account found successfully.",
            },
            404: {
              description: "User not found.",
            },
            401: {
              description: "Not logged in",
            },
          },
        },
      },
      "/verify": {
        get: {
          tags: ["USER"],
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
