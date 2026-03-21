import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Category } from '@/domain/ondehoje/enterprise/entities/category'

import { CategoryAlreadyExistsError } from '../errors/category-already-exists-error'
import { CategoriesRepository } from '../repositories/categories-repository'

interface EditCategoryRequest {
  id: string
  name: Category['name']
  description: Category['description']
}

type EditCategoryResponse = Either<
  ResourceNotFoundError,
  {
    category: Category
  }
>

export class EditCategoryUseCase {
  constructor(private categoriesRepository: CategoriesRepository) {}

  async execute({
    name,
    description,
    id,
  }: EditCategoryRequest): Promise<EditCategoryResponse> {
    const category = await this.categoriesRepository.findById(id)

    if (!category) {
      return failure(new ResourceNotFoundError('Category'))
    }

    const categoryAlreadyExists =
      await this.categoriesRepository.findByName(name)

    if (categoryAlreadyExists) {
      return failure(new CategoryAlreadyExistsError(name))
    }

    category.name = name ?? category.name
    category.description = description ?? category.description

    await this.categoriesRepository.save(category)

    return success({
      category,
    })
  }
}
