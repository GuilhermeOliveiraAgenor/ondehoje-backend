import { faker } from '@faker-js/faker'
import { makeAdvertisementType } from 'test/factories/make-advertisement-type'
import { InMemoryAdvertisementTypesRepository } from 'test/repositories/in-memory-advertisement-types-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { AdvertisementTypeWithSameNameError } from '../errors/advertisement-type-with-same-name-error'
import { AdvertisementTypeWithZeroDays } from '../errors/advertisement-type-with-zero-days-error'
import { AdvertisementTypeWithZeroValue } from '../errors/advertisement-type-with-zero-value-error'
import { EditAdvertisementTypeUseCase } from './edit-advertisement-type'

let inMemoryAdvertisementTypesRepository: InMemoryAdvertisementTypesRepository

let sut: EditAdvertisementTypeUseCase

describe('Edit Advertisement Type', () => {
  beforeEach(() => {
    inMemoryAdvertisementTypesRepository =
      new InMemoryAdvertisementTypesRepository()

    sut = new EditAdvertisementTypeUseCase(inMemoryAdvertisementTypesRepository)
  })

  it('should be able to edit Advertisement Type', async () => {
    const advertisementType = makeAdvertisementType()
    await inMemoryAdvertisementTypesRepository.create(advertisementType)

    const result = await sut.execute({
      name: 'Mensal',
      description: faker.location.continent(),
      days: faker.number.int(),
      value: faker.number.float(),
      advertisementTypeId: advertisementType.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.advertisementType).toMatchObject({
        name: 'Mensal',
      })
    }
    expect(inMemoryAdvertisementTypesRepository.items).toHaveLength(1)
  })

  it('should not be able to zero days Advertisement Type', async () => {
    const advertisementType = makeAdvertisementType()
    await inMemoryAdvertisementTypesRepository.create(advertisementType)

    const result = await sut.execute({
      name: 'Mensal',
      description: faker.location.continent(),
      days: 0,
      value: faker.number.float(),
      advertisementTypeId: advertisementType.id.toString(),
    })

    expect(result.isError()).toBe(true)
    expect(inMemoryAdvertisementTypesRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(AdvertisementTypeWithZeroDays)
  })

  it('should not be able to zero value Advertisement Type', async () => {
    const advertisementType = makeAdvertisementType()
    await inMemoryAdvertisementTypesRepository.create(advertisementType)

    const result = await sut.execute({
      name: faker.person.fullName(),
      description: faker.location.continent(),
      days: faker.number.int(),
      value: 0,
      advertisementTypeId: advertisementType.id.toString(),
    })

    expect(result.isError()).toBe(true)
    expect(inMemoryAdvertisementTypesRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(AdvertisementTypeWithZeroValue)
  })

  it('should not be able register with same name', async () => {
    const advertisementType = makeAdvertisementType({
      name: 'Semanal',
    })
    await inMemoryAdvertisementTypesRepository.create(advertisementType)

    const newAdvertisementType = makeAdvertisementType({
      name: 'Mensal',
    })
    const newAdvertisementTypeId = newAdvertisementType.id.toString()
    await inMemoryAdvertisementTypesRepository.create(newAdvertisementType)

    const result = await sut.execute({
      advertisementTypeId: newAdvertisementTypeId,
      name: 'Semanal',
      description: faker.location.continent(),
      days: faker.number.int(),
      value: faker.number.float(),
    })

    expect(result.isError()).toBe(true)
    expect(inMemoryAdvertisementTypesRepository.items).toHaveLength(2)
    expect(result.value).toBeInstanceOf(AdvertisementTypeWithSameNameError)
  })

  it('should not be able register with null id', async () => {
    const advertisementType = makeAdvertisementType()
    await inMemoryAdvertisementTypesRepository.create(advertisementType)

    const result = await sut.execute({
      name: 'Semanal',
      description: faker.location.continent(),
      days: faker.number.int(),
      value: faker.number.float(),
      advertisementTypeId: '0',
    })

    expect(result.isError()).toBe(true)
    expect(inMemoryAdvertisementTypesRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
