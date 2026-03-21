import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { Category } from '@/domain/ondehoje/enterprise/entities/category'

import { CategoryAlreadyExistsError } from '../errors/category-already-exists-error'
import { CategoriesRepository } from '../repositories/categories-repository'

interface CreateCategoryRequest {
  name: Category['name']
  description: Category['description']
  createdBy: Category['createdBy']
}

type CreateCategoryResponse = Either<
  CategoryAlreadyExistsError,
  {
    category: Category
  }
>

@Injectable()
export class CreateCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    name,
    description,
    createdBy,
  }: CreateCategoryRequest): Promise<CreateCategoryResponse> {
    const categoryAlreadyExists =
      await this.categoriesRepository.findByName(name)

    if (categoryAlreadyExists) {
      return failure(new CategoryAlreadyExistsError(name))
    }

    const category = Category.create({
      name,
      description,
      createdBy,
    })

    await this.categoriesRepository.create(category)

    return success({
      category,
    })
  }
}
