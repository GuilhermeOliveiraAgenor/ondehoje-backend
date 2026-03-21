import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'

import { CategoryAlreadyExistsError } from '../errors/category-already-exists-error'
import { EditCategoryUseCase } from './edit-category'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: EditCategoryUseCase

describe('Edit document type', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()

    sut = new EditCategoryUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to edit document type', async () => {
    const category = makeCategory()
    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute({
      name: 'CNPJ', // campos
      description: 'Documento do CNPJ',
      id: category.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryCategoriesRepository.items[0]).toMatchObject({
      name: 'CNPJ',
      description: 'Documento do CNPJ',
    })
  })

  it('should not be able to edit document type with the same name', async () => {
    const categoryOne = makeCategory({
      name: 'CNPJ',
      description: 'Documento do CNPJ',
    })
    await inMemoryCategoriesRepository.create(categoryOne)

    const categoryTwo = makeCategory({
      name: 'CNPJuiouoi',
      description: 'Documento do CNPJ',
    })
    await inMemoryCategoriesRepository.create(categoryTwo)

    const result = await sut.execute({
      id: categoryTwo.id.toString(),
      name: 'CNPJ',
      description: 'Documento do CNPJ',
    })

    expect(result.isSuccess()).toBe(false)
    expect(result.value).toBeInstanceOf(CategoryAlreadyExistsError)
  })
})
