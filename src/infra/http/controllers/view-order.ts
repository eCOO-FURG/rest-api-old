import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { ViewOrderUseCase } from "@/domain/use-cases/view-order";
import { ViewOrderPresenter } from "../presenters/view-order-presenter";
import { z } from "zod";

export const viewOrderParamsSchema = z.object({
  order_id: z.string().min(1),
});

export async function viewOrder(request: FastifyRequest, reply: FastifyReply) {
  const { order_id } = viewOrderParamsSchema.parse(request.params);

  try {
    const viewOrderUseCase =
      request.diScope.resolve<ViewOrderUseCase>("viewOrderUseCase");

    const { user, order, offers, products, agribusinesses } =
      await viewOrderUseCase.execute({
        order_id,
      });

    return reply
      .status(200)
      .send(
        ViewOrderPresenter.toHttp(user, order, offers, products, agribusinesses)
      );
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
