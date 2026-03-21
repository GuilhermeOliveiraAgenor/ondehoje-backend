import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { Favorite } from '@/domain/ondehoje/enterprise/entities/favorite'

import { FavoritesRepository } from '../repositories/favorites-repository'

interface FetchFavoritesByUserUseCaseRequest {
  userId: string
}
type FetchFavoritesByUserUseCaseResponse = Either<
  null,
  {
    favorites: Favorite[]
  }
>

@Injectable()
export class FetchFavoritesByUserUseCase {
  constructor(private favoritesRepository: FavoritesRepository) {}

  async execute({
    userId,
  }: FetchFavoritesByUserUseCaseRequest): Promise<FetchFavoritesByUserUseCaseResponse> {
    const favorites = await this.favoritesRepository.findManyByUserId(userId)

    return success({
      favorites,
    })
  }
}
