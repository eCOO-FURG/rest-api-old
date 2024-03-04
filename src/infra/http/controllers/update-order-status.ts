import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { UpdateOrderStatusUseCase } from "@/domain/use-cases/update-order-status";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const updateOrderStatusBodySchema = z.object({
  status: z.enum(["READY", "ON_HOLD", "PENDING", "DISPATCHED", "CANCELED"]),
});

const updateOrderStatusQuerySchema = z.object({
  order_id: z.string(),
});

export async function updateOrderStatus(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { status } = updateOrderStatusBodySchema.parse(request.body);
  const { order_id } = updateOrderStatusQuerySchema.parse(request.params);

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
  }
}
