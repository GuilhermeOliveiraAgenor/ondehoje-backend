import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { GetCategoryByIdUseCase } from '@/domain/ondehoje/application/modules/category/use-cases/get-category-by-id'

import { CategoryPresenter } from '../presenters/category-presenter'

@Controller('/:id')
export class GetCategoryByIdController {
  constructor(private getCategoryById: GetCategoryByIdUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.getCategoryById.execute({
      id,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    return {
      category: CategoryPresenter.toHTTP(result.value.category),
    }
  }
}
