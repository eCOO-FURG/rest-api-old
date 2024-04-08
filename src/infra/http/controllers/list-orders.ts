import { OrderPresenter } from "../presenters/order-presenter";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { ListOrdersUseCase } from "@/domain/use-cases/market/list-orders";

export const listOrdersQuerySchema = z.object({
  cycle_id: z.string().min(1),
  page: z.coerce.number().min(1),
  status: z.enum(["READY", "PENDING", "DISPATCHED", "CANCELED", "PAID"]),
});

export async function listOrders(request: FastifyRequest, reply: FastifyReply) {
  const { cycle_id, page, status } = listOrdersQuerySchema.parse(request.query);

  try {
    const listOrdersUseCase =
      request.diScope.resolve<ListOrdersUseCase>("listOrdersUseCase");

    const { orders } = await listOrdersUseCase.execute({
      cycle_id,
      page,
      status,
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
