import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { OffersItemsPresenter } from "../presenters/offers-items-presenter";
import { SearchOffersUseCase } from "@/domain/use-cases/user/search-offers";
import { HttpErrorHandler } from "../errors/error-handler";

export const searchOffersQuerySchema = z.object({
  cycle_id: z.string(),
  product: z.string(),
  page: z.coerce.number().min(1),
});

export async function searchOffers(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { cycle_id, product, page } = searchOffersQuerySchema.parse(
    request.query
  );

  try {
    const searchOffersUseCase = request.diScope.resolve<SearchOffersUseCase>(
      "searchOffersUseCase"
    );

    const { items } = await searchOffersUseCase.execute({
      cycle_id,
      product,
      page,
    });

    return reply.status(200).send(OffersItemsPresenter.toHttp(items));
  } catch (err) {
    HttpErrorHandler.handle(err, reply);
    throw err;
  }
}
