import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UpdateAgribusinessUseCase } from "@/domain/use-cases/market/update-agribusiness";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const updateAgribusinessBodySchema = z.object({
  caf: z.string(),
  name: z.string(),
});

const offerProductsPayloadSchema = z.object({
  agribusiness_id: z.string(),
});

export async function updateAgribusiness(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { caf, name } = updateAgribusinessBodySchema.parse(request.body);

  const { agribusiness_id } = offerProductsPayloadSchema.parse(request.payload);

  try {
    const updateAgribusinessUseCase =
      request.diScope.resolve<UpdateAgribusinessUseCase>(
        "updateAgribusinessUseCase"
      );

    await updateAgribusinessUseCase.execute({
      agribusiness_id,
      caf,
      name,
    });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
  }
}
