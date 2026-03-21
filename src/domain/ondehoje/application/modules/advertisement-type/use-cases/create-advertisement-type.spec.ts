import { faker } from '@faker-js/faker'
import { makeAdvertisementType } from 'test/factories/make-advertisement-type'
import { InMemoryAdvertisementTypesRepository } from 'test/repositories/in-memory-advertisement-types-repository'

import { AdvertisementTypeWithSameNameError } from '../errors/advertisement-type-with-same-name-error'
import { AdvertisementTypeWithZeroDays } from '../errors/advertisement-type-with-zero-days-error'
import { AdvertisementTypeWithZeroValue } from '../errors/advertisement-type-with-zero-value-error'
import { RegisterAdvertisementTypeUseCase } from './create-advertisement-type'

let inMemoryAdvertisementTypesRepository: InMemoryAdvertisementTypesRepository

let sut: RegisterAdvertisementTypeUseCase

describe('Register Advertisement Type', () => {
  beforeEach(() => {
    inMemoryAdvertisementTypesRepository =
      new InMemoryAdvertisementTypesRepository()
    sut = new RegisterAdvertisementTypeUseCase(
      inMemoryAdvertisementTypesRepository,
    )
  })

  it('should be able to register Advertisement Type', async () => {
    const advertisementType = makeAdvertisementType()
    await inMemoryAdvertisementTypesRepository.create(advertisementType)
    const result = await sut.execute({
      name: 'Semanal',
      description: faker.location.continent(),
      days: faker.number.int(),
      value: faker.number.float(),
    })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.advertisementType).toMatchObject({
        name: 'Semanal',
      })
    }
    expect(inMemoryAdvertisementTypesRepository.items).toHaveLength(2)
  })

  it('should not be able to zero days Advertisement Type', async () => {
    const result = await sut.execute({
      name: faker.person.fullName(),
      description: faker.location.continent(),
      days: 0,
      value: faker.number.float(),
    })

    expect(result.isError()).toBe(true)
    expect(inMemoryAdvertisementTypesRepository.items).toHaveLength(0)
    expect(result.value).toBeInstanceOf(AdvertisementTypeWithZeroDays)
  })

  it('should not be able to zero value Advertisement Type', async () => {
    const result = await sut.execute({
      name: faker.person.fullName(),
      description: faker.location.continent(),
      days: faker.number.int(),
      value: 0,
    })

    expect(result.isError()).toBe(true)
    expect(inMemoryAdvertisementTypesRepository.items).toHaveLength(0)
    expect(result.value).toBeInstanceOf(AdvertisementTypeWithZeroValue)
  })

  it('should not be able register with same name', async () => {
    await sut.execute({
      name: 'Semanal',
      description: faker.location.continent(),
      days: faker.number.int(),
      value: faker.number.float(),
    })

    const result = await sut.execute({
      name: 'Semanal',
      description: faker.location.continent(),
      days: faker.number.int(),
      value: faker.number.float(),
    })

    expect(result.isError()).toBe(true)
    expect(inMemoryAdvertisementTypesRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(AdvertisementTypeWithSameNameError)
  })
})
