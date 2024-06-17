import { Prisma, Redirect as PrismaRedirect } from "@prisma/client";

import { Redirect } from "@/domain/entities/redirect";

export class PrismaRedirectMapper {
  static toDomain(raw: PrismaRedirect) {
    return Redirect.create(
      {
        url: raw.url,
        created_at: raw.created_at,
        updated_at: raw.updated_at,
      },
      raw.id
    );
  }

  static toPrisma(redirect: Redirect): Prisma.RedirectUncheckedCreateInput {
    return {
      id: redirect.id.toString(),
      url: redirect.url.toString(),
      created_at: redirect.created_at,
      updated_at: redirect.updated_at,
    };
  }
}
