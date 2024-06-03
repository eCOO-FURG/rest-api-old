import { RegisterCycleUseCase } from "@/domain/use-cases/market/register-cycle";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpErrorHandler } from "../errors/error-handler";

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
    HttpErrorHandler.handle(err, reply);
    throw err;
  }
}
