import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { OffersPresenter } from "../presenters/offers-presenter";
import { InvalidDayForCycleActionError } from "@/domain/use-cases/errors/invalid-day-for-cycle-action-error";
import { SearchOffersUseCase } from "@/domain/use-cases/user/search-offers";

export const searchOffersQuerySchema = z.object({
  cycle_id: z.string(),
  product: z.string(),
});

export async function searchOffers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { cycle_id, product } = searchOffersQuerySchema.parse(request.query);

  try {
    const searchOffersUseCase = request.diScope.resolve<SearchOffersUseCase>(
      "searchOffersUseCase"
    );

    const { offersItems, products } = await searchOffersUseCase.execute({
      cycle_id,
      product,
    });

    return reply
      .status(200)
      .send(OffersPresenter.toHttp(offersItems, products));
  } catch (err) {
    if (err instanceof InvalidDayForCycleActionError) {
      return reply.status(403).send({ message: err.message });
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
