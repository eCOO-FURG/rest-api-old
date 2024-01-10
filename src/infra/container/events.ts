import { OnUserRegistered } from "@/domain/events/on-user-registered";
import { diContainer } from "@fastify/awilix";
import { asFunction } from "awilix";

diContainer.register({
  onUserRegistered: asFunction(
    ({ mailer, peopleRepository, encrypter, viewLoader, paymentsProcessor }) =>
      new OnUserRegistered(
        mailer,
        peopleRepository,
        encrypter,
        viewLoader,
        paymentsProcessor
      )
  ),
});
