import { AuthenticateWithOneTimePasswordUseCase } from "@/domain/use-cases/auth/authenticate-with-one-time-password";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { HttpErrorHandler } from "../errors/error-handler";

export const authenticateBodySchema = z.object({
  email: z.string().email(),
  one_time_password: z.string().min(6),
});

export async function authenticateWithOneTimePassword(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { email, one_time_password } = authenticateBodySchema.parse(
    request.body
  );

  try {
    const authenticateWithPasswordUseCase =
      request.diScope.resolve<AuthenticateWithOneTimePasswordUseCase>(
        "authenticateWithOneTimePasswordUseCase"
      );

    const { token } = await authenticateWithPasswordUseCase.execute({
      email,
      one_time_password,
      ip_address: request.ip,
      user_agent: request.headers["user-agent"] ?? "not-identified",
    });

    return reply.status(200).send({
      token,
    });
  } catch (err) {
    HttpErrorHandler.handle(err, reply);
    throw err;
  }
}
