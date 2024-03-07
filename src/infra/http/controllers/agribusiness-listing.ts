import { AgribusinessListingUseCase } from "@/domain/use-cases/agribusiness-listing";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { AgribusinessPresenter } from "../presenters/agribusiness-presenter";

export const agribusinessListingUseCaseQuerySchema = z.object({
  page: z.string(),
});

export async function agribusinessListing(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { page } = agribusinessListingUseCaseQuerySchema.parse(request.params);

  try {
    const pageNumber = parseInt(page, 10);

    const agribusinessListingUseCase =
      request.diScope.resolve<AgribusinessListingUseCase>(
        "agribusinessListingUseCase"
      );

    const agribusinesses = await agribusinessListingUseCase.execute({
      page: pageNumber,
    });

    return reply.status(200).send(AgribusinessPresenter.toHttp(agribusinesses));
  } catch (err: any) {
    if (err.message === "Invalid page number") {
      return reply.status(400).send("Invalid page number");
    }
    console.error(err);
    return reply.status(500).send("Internal Server Error");
  }
}
