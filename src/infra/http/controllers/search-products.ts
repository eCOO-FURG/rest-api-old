import { SearchProductsUseCase } from "@/domain/use-cases/search-products";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { ProductPresenter } from "../presenters/product-presenter";

export const searchProductsQuerySchema = z.object({
  name: z.string(),
  page: z.coerce.number().min(1),
});

export async function searchProducts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { name, page } = searchProductsQuerySchema.parse(request.query);

  try {
    const searchProductsUseCase =
      request.diScope.resolve<SearchProductsUseCase>("searchProductsUseCase");

    const { products } = await searchProductsUseCase.execute({
      name,
      page,
    });

    return reply.status(200).send(ProductPresenter.toHttp(products));
  } catch (err) {
    throw err;
  }
}
