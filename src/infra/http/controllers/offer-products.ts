import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InvalidDayForCycleActionError } from "@/domain/use-cases/errors/invalid-day-for-cycle-action-error";
import { InvalidWeightError } from "@/domain/use-cases/errors/invalid-weight-error";
import { OfferProductsUseCase } from "@/domain/use-cases/offer-products";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const offerProductsBodySchema = z.object({
  products: z
    .array(
      z.object({
        id: z.string(),
        quantity_or_weight: z.coerce.number(),
        price: z.coerce.number(),
      })
    )
    .refine((products) => products.length > 0, {
      message: "At least one product must be offered",
    }),
});

const offerProductsPayloadSchema = z.object({
  agribusiness_id: z.string(),
});

export async function offerProducts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { products } = offerProductsBodySchema.parse(request.body);

  const { agribusiness_id } = offerProductsPayloadSchema.parse(request.payload);

  try {
    const offerProductsUseCase = request.diScope.resolve<OfferProductsUseCase>(
      "offerProductsUseCase"
    );

    await offerProductsUseCase.execute({
      agribusiness_id,
      products,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof InvalidDayForCycleActionError) {
      return reply.status(403).send({ message: err.message });
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof InvalidWeightError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
