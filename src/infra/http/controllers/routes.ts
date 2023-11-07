import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { getUserProfile } from "./get-user-profile";
import { verifyJwt } from "../middlewares/verify-jwt";
import { refresh } from "./refresh";
import { verify } from "./verify";
import { registerProduct } from "./register-product";
import { offerProducts } from "./offer-products";
import { registerAgribusiness } from "./register-agribusiness";
import { ensureProducer } from "../middlewares/ensure-producer";

export async function routes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);
  app.post("/sessions/refresh", refresh);
  app.post(
    "/products",
    {
      onRequest: [verifyJwt],
    },
    registerProduct
  );
  app.post(
    "/agribusinesses",
    {
      onRequest: [verifyJwt],
    },
    registerAgribusiness
  );
  app.post(
    "/offers",
    {
      onRequest: [verifyJwt, ensureProducer],
    },
    offerProducts
  );

  app.get(
    "/me",
    {
      onRequest: [verifyJwt],
    },
    getUserProfile
  );
  app.get("/verify", verify);
}
