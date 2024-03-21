import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { ViewOrderUseCase } from "@/domain/use-cases/view-order";
import { z } from "zod";
import { OrderPresenter } from "../presenters/order-presenter";

export const viewOrderParamsSchema = z.object({
  order_id: z.string().min(1),
});

export async function viewOrder(request: FastifyRequest, reply: FastifyReply) {
  const { order_id } = viewOrderParamsSchema.parse(request.params);

  try {
    const viewOrderUseCase =
      request.diScope.resolve<ViewOrderUseCase>("viewOrderUseCase");

    const { order, offers, agribusinesses } = await viewOrderUseCase.execute({
      order_id,
    });

    return reply
      .status(200)
      .send(OrderPresenter.toHttp(order, offers, agribusinesses));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
