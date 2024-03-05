import { OnOneTimePasswordRegistered } from "@/domain/events/on-one-time-password-registered";
import { OnUserRegistered } from "@/domain/events/on-user-registered";
import { OnUserVerified } from "@/domain/events/on-user-verified";
import { diContainer } from "@fastify/awilix";
import { asFunction } from "awilix";

diContainer.register({
  onUserRegistered: asFunction(
    ({ mailer, encrypter, viewLoader }) =>
      new OnUserRegistered(mailer, encrypter, viewLoader)
  ),
  onUserVerified: asFunction(
    ({ paymentsProcessor }) => new OnUserVerified(paymentsProcessor)
  ),
  onOneTimePasswordRegistered: asFunction(
    ({ usersRepository, mailer, viewLoader }) =>
      new OnOneTimePasswordRegistered(usersRepository, mailer, viewLoader)
  ),
});
