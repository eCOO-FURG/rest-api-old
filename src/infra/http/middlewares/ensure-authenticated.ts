import { prisma } from "@/infra/database/prisma-service";
import { env } from "@/infra/env";
import { FastifyReply, FastifyRequest } from "fastify";
import * as JwtService from "jsonwebtoken";
import { z } from "zod";

const jwtPayloadSchema = z.object({
  sub: z.string(),
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

    let payload;

    payload = JwtService.verify(token, env.JWT_SECRET, {
      ignoreExpiration: true,
    });

    const { sub } = jwtPayloadSchema.parse(payload);

    try {
      payload = JwtService.verify(token, env.JWT_SECRET);
    } catch (err) {
      if (err instanceof JwtService.TokenExpiredError) {
        const sessionExpiration = new Date(
          Date.now() - env.SESSION_DURATION_IN_DAYS * 24 * 60 * 60 * 1000
        );

        const session = await prisma.session.findFirst({
          where: {
            account_id: sub,
            user_agent: request.headers["user-agent"] ?? "not-identified",
            created_at: {
              gte: sessionExpiration,
            },
          },
        });

        if (!session) {
          return reply.status(401).send({ message: "Session expired." });
        }

        const newAccessToken = JwtService.sign({ sub }, env.JWT_SECRET, {
          expiresIn: "24h",
        });

        reply.header("set-cookie", { access_token: newAccessToken });
      }
    }

    request.payload = {
      sub,
    };
  } catch (err) {
    return reply.status(401).send({ message: "Unauthorized." });
  }
}
