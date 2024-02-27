import { OneTimePassword } from "@/domain/entities/one-time-password";
import { OneTimePasswordsRepository } from "@/domain/repositories/one-time-passwords-repository";
import { PrismaOneTimePasswordMapper } from "../mappers/prisma-one-time-password-mapper";
import { prisma } from "../prisma-service";

export class PrismaOneTimePasswordsRepository
  implements OneTimePasswordsRepository
{
  async save(oneTimePassword: OneTimePassword): Promise<void> {
    const data = PrismaOneTimePasswordMapper.toPrisma(oneTimePassword);

    await prisma.oneTimePassword.create({
      data,
    });
  }

  async expirePreviousOneTimePassword(account_id: string): Promise<void> {
    await prisma.oneTimePassword.updateMany({
      where: {
        account_id,
        used: false,
      },
      data: {
        used: true,
        updated_at: new Date(),
      },
    });
  }
}
