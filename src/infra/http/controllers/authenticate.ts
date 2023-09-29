import { WrongCredentialsError } from "@/domain/use-cases/errors/wrong-credentials-error";
import { AuthenticateUseCase } from "@/domain/use-cases/authenticate";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, password } = authenticateBodySchema.parse(request.body);

  try {
    const authenticateUseCase = request.diScope.resolve<AuthenticateUseCase>(
      "authenticateUseCase"
    );

    const { token } = await authenticateUseCase.execute({
      email,
      password,
    });

    return reply.status(200).send({
      token,
    });
  } catch (err) {
    if (err instanceof WrongCredentialsError) {
      return reply.status(400).send({ message: err.message });
    }
    throw err;
  }
}
