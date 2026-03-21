import { makeCategory } from 'test/factories/make-category'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'

import { FetchCategoriesUseCase } from './fetch-categories'

let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let sut: FetchCategoriesUseCase

describe('List document type', () => {
  beforeEach(() => {
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()

    sut = new FetchCategoriesUseCase(inMemoryCategoriesRepository)
  })

  it('should be able to list document type', async () => {
    const category = makeCategory()
    await inMemoryCategoriesRepository.create(category)

    const result = await sut.execute()

    if (result.isSuccess()) {
      expect(result.value.categories).toHaveLength(1)
    }
  })
})
