// Core
import { FastifyReply, FastifyRequest } from "fastify";

// Libs
import { z } from "zod";

// Use-cases
import { AuthenticateUseCase } from "@/domain/use-cases/auth/authenticate";

// Errors
import { HttpErrorHandler } from "@/infra/http/errors/error-handler";

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  type: z.enum(["BASIC", "OTP"]),
});

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const { email, password, type } = authenticateBodySchema.parse(
      request.body
    );

    const usecase = request.diScope.resolve<AuthenticateUseCase>(
      "authenticateUsecase"
    );

    const { token } = await usecase.execute({
      email,
      password,
      type,
      ip_address: request.ip,
      user_agent: request.headers["user-agent"] ?? "not-identified",
    });

    return reply.status(200).send({ token });
  } catch (error) {
    HttpErrorHandler.handle(error, reply);
  }
}
