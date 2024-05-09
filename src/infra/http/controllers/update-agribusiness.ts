import { UpdateAgribusinessUseCase } from "@/domain/use-cases/market/update-agribusiness";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { handleErrors } from "./error/error-handler";

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
    handleErrors(err, reply);
    throw err;
  }
}
