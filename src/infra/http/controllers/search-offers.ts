import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { SearchOffersUseCase } from "@/domain/use-cases/search-offers";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { OffersPresenter } from "../presenters/offers-presenter";
import { InvalidDayForCycleActionError } from "@/domain/use-cases/errors/invalid-day-for-cycle-action-error";

export const searchOffersQuerySchema = z.object({
  product: z.string(),
});

export async function searchOffers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { product } = searchOffersQuerySchema.parse(request.query);

  try {
    const searchOffersUseCase = request.diScope.resolve<SearchOffersUseCase>(
      "searchOffersUseCase"
    );

    const { offersItems, products } = await searchOffersUseCase.execute({
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
