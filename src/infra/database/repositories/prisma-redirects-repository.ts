import { Redirect } from "@/domain/entities/redirect";
import { RedirectsRepository } from "@/domain/repositories/redirects-repository";
import { prisma } from "../prisma-service";
import { PrismaRedirectMapper } from "../mappers/prisma-redirect-mapper";

export class PrismaRedirectsRepository implements RedirectsRepository {
  async save(redirect: Redirect): Promise<void> {
    const data = PrismaRedirectMapper.toPrisma(redirect);

    await prisma.redirect.create({
      data: { ...data, created_at: undefined },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.redirect.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<Redirect | null> {
    const redirect = await prisma.redirect.findUnique({
      where: {
        id,
      },
    });

    if (!redirect) {
      return null;
    }

    return PrismaRedirectMapper.toDomain({
      ...redirect,
    });
  }
}
