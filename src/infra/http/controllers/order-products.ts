import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { OrderProductsUseCase } from "@/domain/use-cases/order-products";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { InsufficientProductQuantityOrWeightError } from "@/domain/use-cases/errors/insufficient-product-quantity-or-weight-error";
import { InvalidWeightError } from "@/domain/use-cases/errors/invalid-weight-error";
import { OrderPresenter } from "../presenters/order-presenter";
import { InvalidDayForCycleActionError } from "@/domain/use-cases/errors/invalid-day-for-cycle-action-error";

export const orderProductsBodySchema = z.object({
  shipping_address: z.string(),
  cycle_id: z.string(),
  payment_method: z.enum(["PIX", "ON_DELIVERY"]),
  products: z
    .array(
      z.object({
        id: z.string(),
        quantity_or_weight: z.number().min(1),
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
  const { shipping_address, cycle_id, payment_method, products } =
    orderProductsBodySchema.parse(request.body);

  try {
    const orderProductsUseCase = request.diScope.resolve<OrderProductsUseCase>(
      "orderProductsUseCase"
    );

    const { order } = await orderProductsUseCase.execute({
      user_id: request.payload.user_id,
      cycle_id,
      shipping_address,
      products,
      payment_method,
    });

    return reply.status(201).send(OrderPresenter.toHttp(order));
  } catch (err) {
    if (err instanceof InvalidDayForCycleActionError) {
      return reply.status(403).send({ message: err.message });
    }
    if (err instanceof ResourceNotFoundError) {
      return reply.status(404).send({ message: err.message });
    }
    if (err instanceof InsufficientProductQuantityOrWeightError) {
      return reply.status(400).send({ message: err.message });
    }
    if (err instanceof InvalidWeightError) {
      return reply.status(400).send({ message: err.message });
    }

    throw err;
  }
}
