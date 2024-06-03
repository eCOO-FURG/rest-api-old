import { OfferProductsUseCase } from "@/domain/use-cases/market/offer-products";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpErrorHandler } from "../errors/error-handler";

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
    HttpErrorHandler.handle(err, reply);
    throw err;
  }
}
