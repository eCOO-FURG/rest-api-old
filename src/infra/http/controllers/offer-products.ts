import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { InvalidDayForCycleActionError } from "@/domain/use-cases/errors/invalid-day-for-cycle-action-error";
import { InvalidDescriptionError } from "@/domain/use-cases/errors/invalid-description-length.error";
import { InvalidWeightError } from "@/domain/use-cases/errors/invalid-weight-error";
import { ResourceAlreadyExistsError } from "@/domain/use-cases/errors/resource-already-exists-error";
import { OfferProductsUseCase } from "@/domain/use-cases/market/offer-products";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const offerProductsBodySchema = z.object({
  cycle_id: z.string(),
  product: z.object({
    id: z.string(),
    amount: z.coerce.number(),
    price: z.coerce.number(),
    description: z.string().max(200).optional(),
  }),
});

const offerProductsPayloadSchema = z.object({
  agribusiness_id: z.string(),
});

export async function offerProducts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { cycle_id, product } = offerProductsBodySchema.parse(request.body);

  const { agribusiness_id } = offerProductsPayloadSchema.parse(request.payload);

  try {
    const offerProductsUseCase = request.diScope.resolve<OfferProductsUseCase>(
      "offerProductsUseCase"
    );

    await offerProductsUseCase.execute({
      agribusiness_id,
      cycle_id,
      product,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof InvalidDescriptionError) {
      return reply.status(400).send({ message: err.message });
    }
    if (err instanceof ResourceAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
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
