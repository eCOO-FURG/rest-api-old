import { prisma } from "@/infra/database/prisma-service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function ensureAdministrator(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const sub = request.payload.sub;

    const account = await prisma.account.findUniqueOrThrow({
      where: {
        id: sub,
      },
    });

    if (account.email !== "admin@ecoo.com.br") {
      throw new Error();
    }
  } catch (err) {
    return reply.status(401).send({ message: "Not an administrator." });
  }
}
