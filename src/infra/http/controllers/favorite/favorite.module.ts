import { Module } from '@nestjs/common'

import { FetchFavoritesByUserUseCase } from '@/domain/ondehoje/application/modules/favorite/use-cases/fetch-favorites-by-user'
import { ToggleFavoriteUseCase } from '@/domain/ondehoje/application/modules/favorite/use-cases/toggle-favorite'
import { DatabaseModule } from '@/infra/database/database.module'

import { FetchFavoritesByUserController } from './routes/fetch-favorites-by-user.controller'
import { ToggleFavoriteController } from './routes/toggle-favorite.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [ToggleFavoriteController, FetchFavoritesByUserController],
  providers: [ToggleFavoriteUseCase, FetchFavoritesByUserUseCase],
})
export class HttpFavoriteModule {}
