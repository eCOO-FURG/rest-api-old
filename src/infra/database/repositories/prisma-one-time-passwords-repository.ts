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

  async update(oneTimePassword: OneTimePassword): Promise<void> {
    const data = PrismaOneTimePasswordMapper.toPrisma(oneTimePassword);

    await prisma.oneTimePassword.update({
      where: {
        id: oneTimePassword.id.toString(),
      },
      data,
    });
  }

  async expirePreviousForAccountId(account_id: string): Promise<void> {
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

  async findValidByAccountId(
    account_id: string
  ): Promise<OneTimePassword | null> {
    const fifteenMinutesAgo = new Date(new Date().getTime() - 15 * 60 * 1000);

    const oneTimePassword = await prisma.oneTimePassword.findFirst({
      where: {
        used: false,
        account_id: account_id,
        created_at: {
          gte: fifteenMinutesAgo,
        },
      },
    });

    if (!oneTimePassword) {
      return null;
    }

    return PrismaOneTimePasswordMapper.toDomain(oneTimePassword);
  }
}
