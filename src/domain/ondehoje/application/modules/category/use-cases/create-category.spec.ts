import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'

import { CategoryAlreadyExistsError } from '../errors/category-already-exists-error'
import { CreateCategoryUseCase } from './create-category'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: CreateCategoryUseCase

describe('Register category', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    sut = new CreateCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to register category', async () => {
    const result = await sut.execute({
      name: 'Eletrônicos',
      description: 'Categoria de dispositivos eletrônicos',
      createdBy: 'user-123',
    })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.category).toMatchObject({
        name: 'Eletrônicos',
      })
    }
    expect(inMemoryCategoriesRepository.items).toHaveLength(1)
  })

  it('should not be able to register category twice with same name', async () => {
    const category = makeCategory({
      name: 'Eletrônicos',
    })
    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      name: 'Eletrônicos',
      description: 'Categoria duplicada',
      createdBy: 'user-123',
    })

    expect(result.isError()).toBe(true)
    expect(inMemoryCategoriesRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(CategoryAlreadyExistsError)
  })
})
