import { RegisterAgribusinessUseCase } from "@/domain/use-cases/market/register-agribusiness";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { handleErrors } from "./error/error-handler";

export const registerAgribusinessBodySchema = z.object({
  caf: z.string(),
  name: z.string(),
});

export async function registerAgribusiness(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { caf, name } = registerAgribusinessBodySchema.parse(request.body);

  try {
    const registerAgribusinessUseCase =
      request.diScope.resolve<RegisterAgribusinessUseCase>(
        "registerAgribusinessUseCase"
      );

    await registerAgribusinessUseCase.execute({
      user_id: request.payload.user_id,
      caf,
      name,
    });

    return reply.status(201).send();
  } catch (err) {
    handleErrors(err, reply);
    throw err;
  }
}
