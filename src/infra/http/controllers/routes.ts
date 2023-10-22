import { FastifyInstance } from "fastify";
import { register } from "./register";
import { authenticate } from "./authenticate";
import { getUserProfile } from "./get-user-profile";
import { verifyJwt } from "../middlewares/verify-jwt";
import { refresh } from "./refresh";
import { verify } from "./verify";
import { RegisterProduct } from "./register-product";
import { OfferProducts } from "./offer-products";

export async function routes(app: FastifyInstance) {
  app.post("/users", register);
  app.post("/sessions", authenticate);
  app.post("/sessions/refresh", refresh);
  app.post(
    "/products",
    {
      onRequest: [verifyJwt],
    },
    RegisterProduct
  );
  app.post(
    "/offers",
    {
      onRequest: [verifyJwt],
    },
    OfferProducts
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
