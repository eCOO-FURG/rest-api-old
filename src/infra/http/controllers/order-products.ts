import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { DayRestrictedError } from "@/domain/use-cases/errors/day-restricted-error";
import { InsufficientProductQuantityError } from "@/domain/use-cases/errors/insufficient-product-quantity-error";
import { OrderProductsUseCase } from "@/domain/use-cases/order-products";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { PaymentPresenter } from "../presenters/payment-presenter";

export const orderProductsBodySchema = z.object({
  products: z
    .array(
      z.object({
        id: z.string(),
        quantity: z.coerce.number(),
      })
    )
    .refine((products) => products.length > 0, {
      message: "At least one product must be offered",
    }),
});

export async function orderProducts(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { products } = orderProductsBodySchema.parse(request.body);

  try {
    const orderProductsUseCase = request.diScope.resolve<OrderProductsUseCase>(
      "orderProductsUseCase"
    );

    const payment = await orderProductsUseCase.execute({
      account_id: request.payload.sub,
      products,
    });

    return reply.status(201).send(PaymentPresenter.toHttp(payment));
  } catch (err) {
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof DayRestrictedError) {
      return reply.status(403).send({ message: err.message });
    }
    if (err instanceof InsufficientProductQuantityError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
