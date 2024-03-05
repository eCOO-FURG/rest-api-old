import { prisma } from "@/infra/database/prisma-service";
import { env } from "@/infra/env";
import { FastifyReply, FastifyRequest } from "fastify";
import * as JwtService from "jsonwebtoken";
import { z } from "zod";

const jwtPayloadSchema = z.object({
  user_id: z.string(),
  iat: z.coerce.number(),
});

export async function ensureAuthenticated(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send({ message: "Unauthorized." });
    }
    const [, token] = authHeader.split(" ");

    const payload = JwtService.verify(token, env.JWT_SECRET, {
      ignoreExpiration: true,
    });

    const { user_id, iat } = jwtPayloadSchema.parse(payload);

    const now = Date.now();

    const dateInmilliseconds = now / 1000;

    const expired = dateInmilliseconds - iat > 24 * 3600;

    if (expired) {
      const sessionExpiration = now - env.SESSION_DURATION_IN_DAYS * 86400000;

      const session = await prisma.session.findFirst({
        where: {
          account_id: user_id,
          user_agent: request.headers["user-agent"] ?? "not-identified",
          created_at: {
            gte: new Date(sessionExpiration),
          },
        },
      });

      if (!session) {
        return reply.status(401).send({ message: "Session expired." });
      }

      const newAccessToken = JwtService.sign({ user_id }, env.JWT_SECRET, {
        expiresIn: "24h",
      });

      reply.header("set-cookie", { access_token: newAccessToken });
    }

    request.payload = {
      user_id,
    };
  } catch (err) {
    return reply.status(401).send({ message: "Não authorizado." });
  }
}
