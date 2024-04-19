import { ResourceNotFoundError } from "@/core/errors/resource-not-found-error";
import { Encrypter } from "@/domain/cryptography/encrypter";
import { Email } from "@/domain/entities/email";
import { Mailer } from "@/domain/mail/mailer";
import { ViewLoader } from "@/domain/mail/view-loader";
import { UsersRepository } from "@/domain/repositories/users-repository";
import { env } from "@/infra/env";

interface RequestPasswordUpdateUseCaseRequest {
  email: string;
}

export class RequestPasswordUpdateUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private mailer: Mailer,
    private encrypter: Encrypter,
    private viewLoader: ViewLoader
  ) {}

  async execute({ email }: RequestPasswordUpdateUseCaseRequest) {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new ResourceNotFoundError("Email", email);
    }

    const code = await this.encrypter.encrypt({
      user_id: user.id.value,
    });

    const view = await this.viewLoader.load("updatePassword", {
      first_name: user.first_name,
      url: `${env.FRONT_URL}/trocar-senha?code=${code}`,
    });

    const emailMessage = Email.create({
      from: env.ECOO_EMAIL,
      to: user.email,
      subject: "eCOO | Trocar senha",
      view,
    });

    await this.mailer.send(emailMessage);
  }
}
