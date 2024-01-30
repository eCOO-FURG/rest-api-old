import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { HandleOfferUseCase } from "@/domain/use-cases/handle-offer";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export const confirmPaymentBodySchema = z.object({
  event: z.string(),
  payment: z.object({
    externalReference: z.string(),
  }),
});

export async function handleOffer(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { event, payment } = confirmPaymentBodySchema.parse(request.body);

  try {
    const handleOfferUseCase =
      request.diScope.resolve<HandleOfferUseCase>("handleOfferUseCase");
    await handleOfferUseCase.execute({
      order_id: payment.externalReference,
      event: event as "PAYMENT_RECEIVED" | "PAYMENT_OVERDUE",
    });
    return reply.status(200).send();
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    throw err;
  }
}
