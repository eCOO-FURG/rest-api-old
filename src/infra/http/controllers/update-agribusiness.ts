import { UpdateAgribusinessUseCase } from "@/domain/use-cases/update-agribusiness";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const updateAgribusinessBodySchema = z.object({
  caf: z.string(),
  name: z.string(),
  active: z.boolean(),
});

const offerProductsPayloadSchema = z.object({
  agribusiness_id: z.string(),
});

export async function updateAgribusiness(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { caf, name, active } = updateAgribusinessBodySchema.parse(
    request.body
  );

  const { agribusiness_id } = offerProductsPayloadSchema.parse(request.payload);

  try {
    const UpdateAgribusinessUseCase =
      request.diScope.resolve<UpdateAgribusinessUseCase>(
        "updateAgribusinessUseCase"
      );

    await UpdateAgribusinessUseCase.execute({
      agribusiness_id,
      caf,
      name,
      active,
    });
  } catch (err) {
    throw err;
  }
}
