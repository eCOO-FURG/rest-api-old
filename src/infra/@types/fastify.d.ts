import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyRequest {
    payload: {
      user_id: string;
      agribusiness_id?: string | null;
    };
  }
}
