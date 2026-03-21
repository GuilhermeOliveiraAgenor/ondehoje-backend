import { makeAdvertisementType } from 'test/factories/make-advertisement-type'
import { InMemoryAdvertisementTypesRepository } from 'test/repositories/in-memory-advertisement-types-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { GetAdvertisementTypeUseCase } from './get-advertisement-type'

let inMemoryAdvertisementTypesRepository: InMemoryAdvertisementTypesRepository

let sut: GetAdvertisementTypeUseCase

describe('Get Advertisement Type', () => {
  beforeEach(() => {
    inMemoryAdvertisementTypesRepository =
      new InMemoryAdvertisementTypesRepository()

    sut = new GetAdvertisementTypeUseCase(inMemoryAdvertisementTypesRepository)
  })

  it('should be able to get Advertisement Type', async () => {
    const advertisementType = makeAdvertisementType({
      name: 'Semanal',
    })
    const advertisementTypeId = advertisementType.id.toString()
    await inMemoryAdvertisementTypesRepository.create(advertisementType)

    const result = await sut.execute({
      advertisementTypeId,
    })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.advertisementType).toMatchObject({
        name: 'Semanal',
      })
    }
  })

  it('should not be able to get Advertisement Type not exists', async () => {
    const result = await sut.execute({
      advertisementTypeId: '0',
    })

    expect(result.isSuccess()).toBe(false)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
