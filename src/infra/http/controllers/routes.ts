import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { getUserProfile } from "./get-user-profile";
import { ensureAuthenticated } from "../middlewares/ensure-authenticated";
import { refresh } from "./refresh";
import { verify } from "./verify";
import { offerProducts } from "./offer-products";
import { registerAgribusiness } from "./register-agribusiness";
import { ensureAgribusinessAdmin } from "../middlewares/ensure-agribusiness-admin";
import { searchOffers } from "./search-offers";
import { orderProducts } from "./order-products";
import { handleOffer } from "./handle-offer";

export async function routes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/auth", authenticate);
  app.post("/auth/refresh", refresh);
  app.get("/users/verify", verify);

  app.post(
    "/agribusinesses",
    {
      onRequest: [ensureAuthenticated],
    },
    registerAgribusiness
  );

  app.post(
    "/offers",
    {
      onRequest: [ensureAuthenticated, ensureAgribusinessAdmin],
    },
    offerProducts
  );
  app.get("/offers", searchOffers);

  app.get(
    "/me",
    {
      onRequest: [ensureAuthenticated],
    },
    getUserProfile
  );

  app.post(
    "/orders",
    {
      onRequest: [ensureAuthenticated],
    },
    orderProducts
  );

  app.post("/payments", handleOffer);
}
