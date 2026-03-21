import { makeAddress } from 'test/factories/make-address'
import { makeClient } from 'test/factories/make-client'
import { makeImage } from 'test/factories/make-image'
import { makeUserImage } from 'test/factories/make-user-image'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryUserImagesRepository } from 'test/repositories/in-memory-user-images-repository'
import { expect } from 'vitest'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { EditAddressUseCase } from './edit-address'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryUserImagesRepository: InMemoryUserImagesRepository
let inMemoryClientsRepository: InMemoryClientsRepository
let sut: EditAddressUseCase

describe('Edit address use case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryUserImagesRepository = new InMemoryUserImagesRepository()
    inMemoryClientsRepository = new InMemoryClientsRepository(
      inMemoryImagesRepository,
      inMemoryUserImagesRepository,
    )
    sut = new EditAddressUseCase(
      inMemoryAddressesRepository,
      inMemoryClientsRepository,
    )
  })

  it('should be able to edit an address', async () => {
    const client = makeClient()
    inMemoryClientsRepository.create(client)

    const image = makeImage()
    await inMemoryImagesRepository.createMany([image])

    const userImage = makeUserImage({
      imageId: image.id,
      userId: client.id,
    })
    await inMemoryUserImagesRepository.createMany([userImage])

    const address = makeAddress({
      createdBy: client.id,
      street: 'Rua A',
      number: '123',
      complement: 'Apto 1',
      neighborhood: 'Bairro B',
      city: 'Cidade C',
      state: 'Estado D',
      cep: '12345-678',
      longitude: -23.5505,
      latitude: -46.6333,
    })
    inMemoryAddressesRepository.create(address)

    const result = await sut.execute({
      clientId: client.id.toString(),
      addressId: address.id.toString(),
      street: 'Rua B',
      number: '456',
      complement: 'Apto 2',
      neighborhood: 'Bairro C',
      city: 'Cidade D',
      state: 'Estado E',
      cep: '98765-432',
      longitude: -23.5505,
      latitude: -46.6333,
    })
    expect(result.isSuccess()).toBe(true)
    expect(inMemoryAddressesRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          createdBy: client.id,
          id: address.id,
          street: 'Rua B',
          number: '456',
          complement: 'Apto 2',
          neighborhood: 'Bairro C',
          city: 'Cidade D',
          state: 'Estado E',
          cep: '98765-432',
          longitude: -23.5505,
          latitude: -46.6333,
        }),
      ]),
    )
  })

  it('should not be able to edit a non existing address', async () => {
    const result = await sut.execute({
      clientId: 'client-1',
      addressId: 'non-existing-address-id',
    })
    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('Address exists but cannot be changed by logged in user', async () => {
    const trueClient = makeClient({}, new UniqueEntityID('true-client'))
    inMemoryClientsRepository.items.push(trueClient)

    const falseClient = makeClient({}, new UniqueEntityID('false-client'))
    inMemoryClientsRepository.items.push(falseClient)

    const address = makeAddress({
      createdBy: trueClient.id,
    })
    inMemoryAddressesRepository.create(address)

    const result = await sut.execute({
      clientId: falseClient.id.toString(),
      addressId: address.id.toString(),
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
