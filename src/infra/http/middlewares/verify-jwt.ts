import { env } from "@/infra/env";
import { FastifyReply, FastifyRequest } from "fastify";
import * as JwtService from "jsonwebtoken";
import { z } from "zod";

const jwtPayloadSchema = z.object({
  sub: z.string(),
  iat: z.number(),
});

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({ message: "Unauthorized." });
    }

    const [, token] = authHeader.split(" ");

    const payload = JwtService.verify(token, env.JWT_SECRET);

    const { sub, iat } = jwtPayloadSchema.parse(payload);

    request.payload = {
      sub,
      iat: iat.toString(),
    };
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized." });
  }
}
