import { makeInformation } from 'test/factories/make-information'
import { InMemoryInformationsRepository } from 'test/repositories/in-memory-informations-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { EditInformationUseCase } from './edit-information'

let inMemoryInformationsRepository: InMemoryInformationsRepository
let sut: EditInformationUseCase

describe('Edit Information Use Case', () => {
  beforeEach(() => {
    inMemoryInformationsRepository = new InMemoryInformationsRepository()

    sut = new EditInformationUseCase(inMemoryInformationsRepository)
  })

  it('should be able to edit Information', async () => {
    const information = makeInformation()
    await inMemoryInformationsRepository.createMany([information])

    const result = await sut.execute({
      informationId: information.id.toString(),
      name: 'Informações',
      description: 'Lista de informações',
      phoneNumber: '89899889',
      email: 'joao@gmail.com',
      updatedBy: 'user-1',
    })

    expect(result.isSuccess()).toBe(true)

    if (result.isSuccess()) {
      expect(result.value.information).toMatchObject({
        name: 'Informações',
        description: 'Lista de informações',
        email: 'joao@gmail.com',
      })
    }

    expect(inMemoryInformationsRepository.items).toHaveLength(1)
  })

  it('should be able to edit Information with id not exists', async () => {
    const information = makeInformation()
    await inMemoryInformationsRepository.createMany([information])

    const result = await sut.execute({
      informationId: '0',
      name: 'Informações',
      description: 'Lista de informações',
      phoneNumber: '89899889',
      email: 'joao@gmail.com',
      updatedBy: 'user-1',
    })

    expect(result.isError()).toBe(true)
    expect(inMemoryInformationsRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
