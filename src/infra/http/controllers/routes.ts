import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { getUserProfile } from "./get-user-profile";
import { verifyJwt } from "../middlewares/verify-jwt";
import { refresh } from "./refresh";
import { verify } from "./verify";
import { offerProducts } from "./offer-products";
import { registerAgribusiness } from "./register-agribusiness";
import { ensureProducer } from "../middlewares/ensure-producer";
import { searchOffers } from "./search-offers";
import { orderProducts } from "./order-products";

export async function routes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/auth", authenticate);
  app.post("/auth/refresh", refresh);
  app.get("/users/verify", verify);

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
  app.get("/offers", searchOffers);

  app.get(
    "/me",
    {
      onRequest: [verifyJwt],
    },
    getUserProfile
  );

  app.post(
    "/orders",
    {
      onRequest: [verifyJwt],
    },
    orderProducts
  );
}
