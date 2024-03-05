import { OrdersListingUseCase } from "@/domain/use-cases/orders-listing";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const ordersListingQuerySchema = z.object({
  page: z.string(),
});

export async function OrdersListing(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { page } = ordersListingQuerySchema.parse(request.params);

  try {
    const pageNumber = parseInt(page, 10);

    const ordersListingUseCase = request.diScope.resolve<OrdersListingUseCase>(
      "ordersListingUseCase"
    );

    const orders = await ordersListingUseCase.execute({
      page: pageNumber,
    });

    return reply.status(200).send(orders);
  } catch (err) {
    if (err) {
      return reply.status(400).send("invalid page number");
    }
  }
}
