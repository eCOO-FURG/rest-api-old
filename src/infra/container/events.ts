import { OnOneTimePasswordRegistered } from "@/domain/events/on-one-time-password-registered";
import { OnUserRegistered } from "@/domain/events/on-user-registered";
import { OnUserVerified } from "@/domain/events/on-user-verified";
import { diContainer } from "@fastify/awilix";
import { asFunction } from "awilix";

diContainer.register({
  onUserRegistered: asFunction(
    ({ mailer, peopleRepository, encrypter, viewLoader }) =>
      new OnUserRegistered(mailer, peopleRepository, encrypter, viewLoader)
  ),
  onUserVerified: asFunction(
    ({ peopleRepository, paymentsProcessor }) =>
      new OnUserVerified(peopleRepository, paymentsProcessor)
  ),
  onOneTimePasswordRegistered: asFunction(
    ({ accountsRepository, mailer, viewLoader }) =>
      new OnOneTimePasswordRegistered(accountsRepository, mailer, viewLoader)
  ),
});
