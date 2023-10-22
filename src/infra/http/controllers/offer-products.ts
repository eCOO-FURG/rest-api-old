import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OfferProductsUseCase } from "@/domain/use-cases/offer-products";
import { error } from "console";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const offerProductsBodySchema = z.object({
  products: z
    .array(
      z.object({
        product_id: z.string(),
        weight: z.string(),
        quantity: z.string(),
        amount: z.string(),
      })
    )
    .refine((products) => products.length > 0, {
      message: "At least one product must be offered",
    }),
});

export async function offerProducts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { products } = offerProductsBodySchema.parse(request.body);

  try {
    const offerProductsUseCase = request.diScope.resolve<OfferProductsUseCase>(
      "offerProductsUseCase"
    );

    await offerProductsUseCase.execute({
      account_id: "",
      agribusiness_id: "",
      products,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
