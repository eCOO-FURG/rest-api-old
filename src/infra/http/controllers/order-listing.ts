import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OrderListingUseCase } from "@/domain/use-cases/order-listing";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { SingleOrderPresenter } from "../presenters/single-order-presenter";

export const orderListingQuerySchema = z.object({
  order_id: z.string(),
});

export async function OrderListing(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { order_id } = orderListingQuerySchema.parse(request.params);

  try {
    const orderListingUseCase = request.diScope.resolve<OrderListingUseCase>(
      "orderListingUseCase"
    );

    const order = await orderListingUseCase.execute({
      order_id: order_id,
    });

    return reply.status(200).send(SingleOrderPresenter.toHttp([order]));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send("Order not found");
    }
  }
}
