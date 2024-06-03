import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { OrderPresenter } from "../presenters/order-presenter";
import { OrderProductsUseCase } from "@/domain/use-cases/user/order-products";
import { HttpErrorHandler } from "../errors/error-handler";

export const orderProductsBodySchema = z.object({
  shipping_address: z.string().nullable(),
  cycle_id: z.string(),
  payment_method: z.enum(["ON_DELIVERY"]),
  products: z
    .array(
      z.object({
        id: z.string(),
        amount: z.number().min(1),
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
    HttpErrorHandler.handle(err, reply);
    throw err;
  }
}
