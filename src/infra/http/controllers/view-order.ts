import { FastifyReply, FastifyRequest } from "fastify";
import { ViewOrderUseCase } from "@/domain/use-cases/view-order";
import { z } from "zod";
import { OrderWithItemsPresenter } from "../presenters/order-with-items-presenter";
import { handleErrors } from "./error/error-handler";

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
      .send(OrderWithItemsPresenter.toHttp(order, offers, agribusinesses));
  } catch (err) {
    handleErrors(err, reply);
    throw err;
  }
}
