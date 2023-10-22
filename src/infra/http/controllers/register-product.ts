import { ResourceAlreadyExistsError } from "@/core/errors/resource-already-exists-error";
import { RegisterProductUseCase } from "@/domain/use-cases/register-product";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const registerProductBodySchema = z.object({
  name: z.string(),
});

export async function registerProduct(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { name } = registerProductBodySchema.parse(request.body);

  try {
    const registerProductUseCase =
      request.diScope.resolve<RegisterProductUseCase>("registerProductUseCase");

    await registerProductUseCase.execute({
      name,
    });

    return reply.status(201).send();
  } catch (err) {
    if (err instanceof ResourceAlreadyExistsError) {
      return reply.status(409).send({ message: err.message });
    }
    throw err;
  }
}
