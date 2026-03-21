import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { GetCategoryByIdUseCase } from './get-category-by-id'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: GetCategoryByIdUseCase

describe('List document type', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()

    sut = new GetCategoryByIdUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to get category by id', async () => {
    const category = makeCategory({
      name: 'CNPJ',
      description: 'Documento do CNPJ',
    })
    const categoryId = category.id.toString()
    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      id: categoryId,
    })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.category).toMatchObject({
        name: 'CNPJ',
        description: 'Documento do CNPJ',
      })
    }
  })

  it('should not be able to get category that not exists', async () => {
    const result = await sut.execute({
      id: '0',
    })

    expect(result.isSuccess()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
