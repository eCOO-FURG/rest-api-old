import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InvalidCycleError } from "@/domain/use-cases/errors/invalid-cycle-error";
import { InvalidScheduleDate } from "@/domain/use-cases/errors/invalid-schedule-date";
import { ScheduleConflictError } from "@/domain/use-cases/errors/schedule-conflict-error";
import { ScheduleCycleUseCase } from "@/domain/use-cases/schedule-cycle";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const scheduleCycleBodySchema = z.object({
  start_at: z.coerce.date(),
  cycle_id: z.string(),
});

export async function scheduleCycle(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { cycle_id, start_at } = scheduleCycleBodySchema.parse(request.body);

  try {
    console.log("DATA: ", start_at);

    const scheduleCycleUseCase = request.diScope.resolve<ScheduleCycleUseCase>(
      "scheduleCycleUseCase"
    );

    await scheduleCycleUseCase.execute({
      cycle_id,
      start_at,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (
      err instanceof ScheduleConflictError ||
      err instanceof InvalidScheduleDate
    ) {
      return reply.status(409).send({ message: err.message });
    }
    throw err;
  }
}
