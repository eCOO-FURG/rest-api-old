import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateOrderStatusUseCase } from "@/domain/use-cases/update-order-status";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InvalidOrderStatusError } from "@/domain/use-cases/errors/invalid-order-status-error";

export const updateOrderStatusParamsSchema = z.object({
  order_id: z.string(),
});

export const updateOrderStatusBodySchema = z.object({
  status: z.enum(["READY", "PENDING", "DISPATCHED", "CANCELED", "PAID"]),
});

export async function updateOrderStatus(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { order_id } = updateOrderStatusParamsSchema.parse(request.params);

  const { status } = updateOrderStatusBodySchema.parse(request.body);

  try {
    const updateOrderStatusUseCase =
      request.diScope.resolve<UpdateOrderStatusUseCase>(
        "updateOrderStatusUseCase"
      );

    await updateOrderStatusUseCase.execute({
      order_id,
      status,
    });
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof InvalidOrderStatusError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
