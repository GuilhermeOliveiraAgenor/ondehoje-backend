import { BadRequestException, Controller, Get } from '@nestjs/common'

import { FetchCategoriesUseCase } from '@/domain/ondehoje/application/modules/category/use-cases/fetch-categories'
import { Public } from '@/infra/auth/decorators/public'

import { CategoryPresenter } from '../presenters/category-presenter'

@Controller('/')
@Public()
export class FetchCategoriesController {
  constructor(private fetchCategories: FetchCategoriesUseCase) {}

  @Get()
  async handle() {
    const result = await this.fetchCategories.execute()

    if (result.isError()) {
      throw new BadRequestException()
    }

    const categories = result.value.categories

    return {
      categories: categories.map(CategoryPresenter.toHTTP),
    }
  }
}
