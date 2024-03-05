import { AlreadyAgribusinessAdminError } from "@/domain/use-cases/errors/already-agribusiness-admin-error";
import { ResourceAlreadyExistsError } from "@/domain/use-cases/errors/resource-already-exists-error";
import { RegisterAgribusinessUseCase } from "@/domain/use-cases/register-agribusiness";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

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
    if (
      err instanceof ResourceAlreadyExistsError ||
      err instanceof AlreadyAgribusinessAdminError
    ) {
      return reply.status(409).send({ message: err.message });
    }
    throw err;
  }
}
