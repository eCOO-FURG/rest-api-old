import { prisma } from "@/infra/database/prisma-service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function ensureAgribusinessAdmin(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const user_id = request.payload.user_id;

    const agribusiness = await prisma.agribusiness.findUniqueOrThrow({
      where: {
        admin_id: user_id,
      },
    });

    request.payload.agribusiness_id = agribusiness.id;
  } catch (err) {
    return reply
      .status(401)
      .send({ message: "Não é um administrador de agronegócio." });
  }
}
