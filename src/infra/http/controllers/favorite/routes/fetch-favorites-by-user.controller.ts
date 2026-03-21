import { BadRequestException, Controller, Get } from '@nestjs/common'

import { FetchFavoritesByUserUseCase } from '@/domain/ondehoje/application/modules/favorite/use-cases/fetch-favorites-by-user'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { IdentityDetails } from '@/infra/auth/strategies/jwt.strategy'

import { FavoritesPresenter } from '../presenters/favorites-presenter'

@Controller('/')
export class FetchFavoritesByUserController {
  constructor(private fetchFavoritesByUser: FetchFavoritesByUserUseCase) {}

  @Get()
  async handle(@CurrentUser() loggedUser: IdentityDetails) {
    const userId = loggedUser.sub

    const result = await this.fetchFavoritesByUser.execute({
      userId,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const { favorites } = result.value

    return {
      favorites: favorites.map(FavoritesPresenter.toHTTP),
    }
  }
}
