import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Category } from '@/domain/ondehoje/enterprise/entities/category'

import { CategoriesRepository } from '../repositories/categories-repository'

interface GetCategoryByIdRequest {
  id: string
}

type GetCategoryByIdResponse = Either<
  ResourceNotFoundError,
  { category: Category }
>

@Injectable()
export class GetCategoryByIdUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    id,
  }: GetCategoryByIdRequest): Promise<GetCategoryByIdResponse> {
    const category = await this.categoriesRepository.findById(id)

    if (!category) {
      return failure(new ResourceNotFoundError('Category'))
    }

    return success({
      category,
    })
  }
}
