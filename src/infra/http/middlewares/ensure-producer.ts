import { prisma } from "@/infra/database/prisma-service";
import { FastifyReply, FastifyRequest } from "fastify";

export async function ensureProducer(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const sub = request.payload.sub;

    const agribusiness = await prisma.agribusiness.findUniqueOrThrow({
      where: {
        admin_id: sub,
      },
    });

    request.payload.agribusiness_id = agribusiness.id;
  } catch (err) {
    return reply.status(401).send({ message: "Not a producer." });
  }
}
