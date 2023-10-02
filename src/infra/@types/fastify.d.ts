import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    payload: {
      sub: string;
      iat: string;
    };
  }
}
