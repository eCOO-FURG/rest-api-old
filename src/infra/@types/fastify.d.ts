import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    payload: {
      sub: string;
      agribusiness_id?: string | null;
    };
  }
}
