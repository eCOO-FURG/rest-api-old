import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { ListOfOrdersUseCase } from "@/domain/use-cases/list-of-orders";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const listOfOrdersQuerySchema = z.object({
  order_status: z.string(),
});

export async function listOfOrders(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { order_status } = listOfOrdersQuerySchema.parse(request.query);

  try {
    const listOfOrdersUseCase = request.diScope.resolve<ListOfOrdersUseCase>(
      "listOfOrdersUseCase"
    );

    const listOfOrders = await listOfOrdersUseCase.execute({
      order_status,
    });

    return reply.status(200).send(listOfOrders);
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
  }
}
