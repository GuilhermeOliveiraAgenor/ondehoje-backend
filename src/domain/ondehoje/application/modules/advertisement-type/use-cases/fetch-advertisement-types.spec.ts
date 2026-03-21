import { makeAdvertisementType } from 'test/factories/make-advertisement-type'
import { InMemoryAdvertisementTypesRepository } from 'test/repositories/in-memory-advertisement-types-repository'

import { FetchAdvertisementTypesUseCase } from './fetch-advertisement-types'

let inMemoryAdvertisementTypesRepository: InMemoryAdvertisementTypesRepository

let sut: FetchAdvertisementTypesUseCase

describe('Fetch Advertisement Types', () => {
  beforeEach(() => {
    inMemoryAdvertisementTypesRepository =
      new InMemoryAdvertisementTypesRepository()

    sut = new FetchAdvertisementTypesUseCase(
      inMemoryAdvertisementTypesRepository,
    )
  })

  it('should be able to fetch advertisement types', async () => {
    const advertisementType = makeAdvertisementType()
    await inMemoryAdvertisementTypesRepository.create(advertisementType)

    const result = await sut.execute()

    if (result.isSuccess()) {
      expect(result.value.advertisementTypes).toHaveLength(1)
    }
  })
})
