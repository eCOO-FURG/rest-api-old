import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { getUserProfile } from "./get-user-profile";
import { verifyJwt } from "../middlewares/verify-jwt";

export async function routes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);

  app.get(
    "/me",
    {
      onRequest: [verifyJwt],
    },
    getUserProfile
  );
}
