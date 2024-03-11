import { ListCycleUseCase } from "@/domain/use-cases/list-cycles";
import { FastifyReply, FastifyRequest } from "fastify";
import { CyclesPresenter } from "../presenters/cycles-presenter";

export async function listCycles(request: FastifyRequest, reply: FastifyReply) {
  try {
    const listCyclesUseCase =
      request.diScope.resolve<ListCycleUseCase>("listCyclesUseCase");

    const { cycles } = await listCyclesUseCase.execute();

    return reply.status(200).send(CyclesPresenter.toHttp(cycles));
  } catch (err) {
    throw err;
  }
}
