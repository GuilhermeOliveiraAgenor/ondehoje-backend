import { Favorite as PrismaFavorite, Prisma } from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Favorite } from '@/domain/ondehoje/enterprise/entities/favorite'

export class PrismaFavoriteMapper {
  static toDomain(raw: PrismaFavorite): Favorite {
    return Favorite.create(
      {
        userId: new UniqueEntityID(raw.userId),
        eventId: raw.eventId ? new UniqueEntityID(raw.eventId) : null,
        companyId: raw.companyId ? new UniqueEntityID(raw.companyId) : null,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPersistency(raw: Favorite): Prisma.FavoriteUncheckedCreateInput {
    return {
      id: raw.id.toString(),
      userId: raw.userId.toString(),
      eventId: raw.eventId?.toString(),
      companyId: raw.companyId?.toString(),
      createdAt: raw.createdAt,
    }
  }
}
