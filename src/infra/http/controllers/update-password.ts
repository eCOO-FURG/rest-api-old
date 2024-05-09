import { UpdatePasswordUseCase } from "@/domain/use-cases/user/update-password";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { handleErrors } from "./error/error-handler";

export const updatePasswordBodySchema = z.object({
  password: z.string().min(8),
});

export async function updatePassword(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const user_id = request.payload.user_id;
    const { password } = updatePasswordBodySchema.parse(request.body);

    const updatePasswordUseCase =
      request.diScope.resolve<UpdatePasswordUseCase>("updatePasswordUseCase");

    await updatePasswordUseCase.execute({
      user_id,
      password,
    });

    return reply.status(200).send();
  } catch (err) {
    handleErrors(err, reply);
    throw err;
  }
}
