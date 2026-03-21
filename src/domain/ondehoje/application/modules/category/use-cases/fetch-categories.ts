import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { Category } from '@/domain/ondehoje/enterprise/entities/category'

import { CategoriesRepository } from '../repositories/categories-repository'

type FetchCategoriesUseCaseResponse = Either<
  null,
  {
    categories: Category[]
  }
>

@Injectable()
export class FetchCategoriesUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute(): Promise<FetchCategoriesUseCaseResponse> {
    const categories = await this.categoriesRepository.findMany()

    return success({
      categories,
    })
  }
}
