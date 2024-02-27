import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UpdateAgribusinessStatusUseCase } from "@/domain/use-cases/update-agribusiness-status";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const updateAgribusinessStatusQuerySchema = z.object({
  agribusiness_id: z.string(),
});

export async function updateAgribusinessStatus(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { agribusiness_id } = updateAgribusinessStatusQuerySchema.parse(
    request.params
  );

  try {
    const updateAgribusinessStatusUseCase =
      request.diScope.resolve<UpdateAgribusinessStatusUseCase>(
        "updateAgribusinessStatusUseCase"
      );

    await updateAgribusinessStatusUseCase.execute({
      agribusiness_id,
    });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
  }
}
