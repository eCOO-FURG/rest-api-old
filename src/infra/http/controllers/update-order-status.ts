import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { UpdateOrderStatusUseCase } from "@/domain/use-cases/market/update-order-status";
import { HttpErrorHandler } from "../errors/error-handler";

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

    return reply.status(200).send();
  } catch (err) {
    HttpErrorHandler.handle(err, reply);
    throw err;
  }
}
