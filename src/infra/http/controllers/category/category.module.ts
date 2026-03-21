import { Module } from '@nestjs/common'

import { CreateCategoryUseCase } from '@/domain/ondehoje/application/modules/category/use-cases/create-category'
import { FetchCategoriesUseCase } from '@/domain/ondehoje/application/modules/category/use-cases/fetch-categories'
import { GetCategoryByIdUseCase } from '@/domain/ondehoje/application/modules/category/use-cases/get-category-by-id'
import { DatabaseModule } from '@/infra/database/database.module'

import { CreateCategoryController } from './routes/create-category.controller'
import { FetchCategoriesController } from './routes/fetch-categories.controller'
import { GetCategoryByIdController } from './routes/get-category-by-id.controller'

@Module({
  imports: [DatabaseModule],
  controllers: [
    CreateCategoryController,
    FetchCategoriesController,
    GetCategoryByIdController,
  ],
  providers: [
    CreateCategoryUseCase,
    FetchCategoriesUseCase,
    GetCategoryByIdUseCase,
  ],
})
export class HttpCategoryModule {}
