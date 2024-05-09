import { UpdateAgribusinessStatusUseCase } from "@/domain/use-cases/market/update-agribusiness-status";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { handleErrors } from "./error/error-handler";

const updateAgribusinessStatusParamsSchema = z.object({
  agribusiness_id: z.string(),
});

export async function updateAgribusinessStatus(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { agribusiness_id } = updateAgribusinessStatusParamsSchema.parse(
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
    handleErrors(err, reply);
    throw err;
  }
}
