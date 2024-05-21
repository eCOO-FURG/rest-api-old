import { prisma } from "@/infra/database/prisma-service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function ensureAdministrator(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const user_id = request.payload.user_id;

    const account = await prisma.account.findUniqueOrThrow({
      where: {
        id: user_id,
      },
    });

    if (!account.roles.includes("ADMIN")) {
      throw new Error();
    }
  } catch (err) {
    return reply.status(403).send({ message: "Não é um administrador." });
  }
}
