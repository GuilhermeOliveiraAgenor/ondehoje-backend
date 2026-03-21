import { makeAddress } from 'test/factories/make-address'
import { makeClient } from 'test/factories/make-client'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryUserImagesRepository } from 'test/repositories/in-memory-user-images-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { DeleteAddressUseCase } from './delete-address'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryUserImagesRepository: InMemoryUserImagesRepository
let inMemoryClientsRepository: InMemoryClientsRepository
let sut: DeleteAddressUseCase

describe('Delete address use case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryUserImagesRepository = new InMemoryUserImagesRepository()
    inMemoryClientsRepository = new InMemoryClientsRepository(
      inMemoryImagesRepository,
      inMemoryUserImagesRepository,
    )
    sut = new DeleteAddressUseCase(
      inMemoryAddressesRepository,
      inMemoryClientsRepository,
    )
  })

  it('should be able to delete an address', async () => {
    const clientId = new UniqueEntityID('client-1')
    const client = makeClient({}, clientId)
    const newAddress = makeAddress({
      createdBy: clientId,
      street: 'Maria homam',
    })

    await inMemoryClientsRepository.create(client)
    await inMemoryAddressesRepository.create(newAddress)

    const result = await sut.execute({
      addressId: newAddress.id,
      clientId: new UniqueEntityID('client-1'),
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryAddressesRepository.items).toHaveLength(0)
    expect(inMemoryAddressesRepository.items).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          clientId: 'client-1',
        }),
      ]),
    )
  })

  it('should not be able to delete an address with a non-existing client', async () => {
    const newAddress = makeAddress({}, new UniqueEntityID('address-1'))
    await inMemoryAddressesRepository.create(newAddress)

    const result = await sut.execute({
      addressId: new UniqueEntityID('address-1'),
      clientId: new UniqueEntityID('non-existing-client'),
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(inMemoryAddressesRepository.items).toHaveLength(1)
  })

  it('should not be able to delete an address created by another client', async () => {
    const safeClientId = new UniqueEntityID('safe-client')
    const notClientId = new UniqueEntityID('not-client')

    const safeClient = makeClient({}, safeClientId)
    const notClient = makeClient({}, notClientId)
    const newAddress = makeAddress({
      createdBy: safeClientId,
    })

    await inMemoryClientsRepository.create(safeClient)
    await inMemoryClientsRepository.create(notClient)
    await inMemoryAddressesRepository.create(newAddress)

    const result = await sut.execute({
      addressId: newAddress.id,
      clientId: notClientId,
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryAddressesRepository.items).toHaveLength(1)
  })
})
