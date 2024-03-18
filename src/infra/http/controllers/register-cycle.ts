import { InvalidCycleError } from "@/domain/use-cases/errors/invalid-cycle-error";
import { ResourceAlreadyExistsError } from "@/domain/use-cases/errors/resource-already-exists-error";
import { RegisterCycleUseCase } from "@/domain/use-cases/market/register-cycle";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const registerCycleBodySchema = z.object({
  alias: z.string(),
  offering: z.array(z.coerce.number()),
  ordering: z.array(z.coerce.number()),
  dispatching: z.array(z.coerce.number()),
  duration: z.coerce.number(),
});

export async function registerCycle(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { alias, offering, ordering, dispatching, duration } =
    registerCycleBodySchema.parse(request.body);

  try {
    const registerCycleUseCase = request.diScope.resolve<RegisterCycleUseCase>(
      "registerCycleUseCase"
    );

    await registerCycleUseCase.execute({
      alias,
      offering,
      ordering,
      dispatching,
      duration,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof ResourceAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    if (err instanceof InvalidCycleError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
