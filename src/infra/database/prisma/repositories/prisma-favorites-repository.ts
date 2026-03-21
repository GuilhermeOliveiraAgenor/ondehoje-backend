import { Injectable } from '@nestjs/common'

import { AdvertisementStatus } from '@/domain/ondehoje/application/modules/advertisement/enums/advertisement-status'
import { FavoritesRepository } from '@/domain/ondehoje/application/modules/favorite/repositories/favorites-repository'
import { Favorite } from '@/domain/ondehoje/enterprise/entities/favorite'

import { PrismaFavoriteMapper } from '../mappers/prisma-favorite-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaFavoritesRepository implements FavoritesRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Favorite | null> {
    const [favorite] = await this.prisma.$transaction([
      this.prisma.favorite.findUnique({
        where: {
          id,
        },
      }),
    ])

    if (!favorite) {
      return null
    }

    return PrismaFavoriteMapper.toDomain(favorite)
  }

  async findMyFavorites(userId: string): Promise<Favorite[]> {
    const [favorites] = await this.prisma.$transaction([
      this.prisma.favorite.findMany({
        where: {
          userId,
        },
      }),
    ])

    return favorites.map(PrismaFavoriteMapper.toDomain)
  }

  async findManyByUserId(userId: string): Promise<Favorite[]> {
    const [favorites] = await this.prisma.$transaction([
      this.prisma.favorite.findMany({
        where: {
          userId,
          event: {
            advertisements: {
              some: {
                status: AdvertisementStatus.ACTIVE,
              },
            },
          },
          company: {
            advertisements: {
              some: {
                status: AdvertisementStatus.ACTIVE,
              },
            },
          },
        },
      }),
    ])

    return favorites.map(PrismaFavoriteMapper.toDomain)
  }

  async create(favorite: Favorite): Promise<void> {
    const data = PrismaFavoriteMapper.toPersistency(favorite)

    await this.prisma.$transaction([
      this.prisma.favorite.create({
        data,
      }),
    ])
  }

  async delete(favorite: Favorite): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.favorite.delete({
        where: {
          id: favorite.id.toString(),
        },
      }),
    ])
  }
}
