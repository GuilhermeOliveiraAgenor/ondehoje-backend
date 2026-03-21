import { Injectable } from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Favorite,
  FavoriteProps,
} from '@/domain/ondehoje/enterprise/entities/favorite'
import { PrismaFavoriteMapper } from '@/infra/database/prisma/mappers/prisma-favorite-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export function makeFavorite(
  override: Partial<Favorite> = {},
  id?: UniqueEntityID,
) {
  const favorite = Favorite.create(
    {
      userId: new UniqueEntityID(),
      ...override,
    },
    id,
  )

  return favorite
}

@Injectable()
export class FavoriteFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaFavorite(
    data: Partial<FavoriteProps> = {},
  ): Promise<Favorite> {
    const favorite = makeFavorite(data)

    await this.prisma.favorite.create({
      data: PrismaFavoriteMapper.toPersistency(favorite),
    })

    return favorite
  }
}
