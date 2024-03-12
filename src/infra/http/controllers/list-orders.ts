import { ListOrdersUseCase } from "@/domain/use-cases/list-orders";
import { OrderPresenter } from "../presenters/order-presenter";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";

export const listOrdersQuerySchema = z.object({
  cycle_id: z.string().min(1),
  page: z.coerce.number().min(1),
});

export async function listOrders(request: FastifyRequest, reply: FastifyReply) {
  const { cycle_id, page } = listOrdersQuerySchema.parse(request.query);

  try {
    const listOrdersUseCase =
      request.diScope.resolve<ListOrdersUseCase>("listOrdersUseCase");

    const { orders } = await listOrdersUseCase.execute({
      cycle_id,
      page,
    });

    return reply
      .status(200)
      .send(orders.map((order) => OrderPresenter.toHttp(order)));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
