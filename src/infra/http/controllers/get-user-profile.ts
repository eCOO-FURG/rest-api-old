import { FastifyReply, FastifyRequest } from "fastify";
import { UserPresenter } from "../presenters/user-presenter";
import { GetUserProfileUseCase } from "@/domain/use-cases/user/get-user-profile";
import { handleErrors } from "./error/error-handler";

export async function getUserProfile(
  request: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const getUserProfileUseCase =
      request.diScope.resolve<GetUserProfileUseCase>("getUserProfileUseCase");

    const { user } = await getUserProfileUseCase.execute({
      user_id: request.payload.user_id,
    });

    return reply.status(200).send(UserPresenter.toHttp(user));
  } catch (err) {
    handleErrors(err, reply);
    throw err;
  }
}
