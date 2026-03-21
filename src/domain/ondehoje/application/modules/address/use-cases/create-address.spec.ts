import { makeAddress } from 'test/factories/make-address'
import { makeClient } from 'test/factories/make-client'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'

import { AddressAlreadyExistsError } from '../errors/address-already-exists-error'
import { CreateAddressUseCase } from './create-address'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let sut: CreateAddressUseCase

describe('Create address use case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    sut = new CreateAddressUseCase(inMemoryAddressesRepository)
  })

  it('should be able to create a address', async () => {
    const result = await sut.execute({
      street: 'Maria homam',
      complement: 'casa',
      neighborhood: 'Centro',
      number: '123',
      cep: '81270000',
      city: 'Curitiba',
      state: 'PR',
      longitude: 49.2659,
      latitude: 25.4284,
      createdBy: 'client-1',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      address: inMemoryAddressesRepository.items[0],
    })
  })

  it('should not be able to create address that already exists', async () => {
    const client = makeClient()
    const clientId = client.id.toString()

    const address = makeAddress({
      street: 'Rua Maria Homem',
      complement: 'casa',
      neighborhood: 'Centro',
      number: '123',
      cep: '81270000',
      city: 'Curitiba',
      state: 'PR',
      longitude: 49.2659,
      latitude: 25.4284,
      createdBy: client.id,
    })
    await inMemoryAddressesRepository.create(address)

    const result = await sut.execute({
      street: 'Rua Maria Homem',
      complement: 'casa',
      neighborhood: 'Centro',
      number: '123',
      cep: '81270000',
      city: 'Curitiba',
      state: 'PR',
      longitude: 49.2659,
      latitude: 25.4284,
      createdBy: clientId,
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(AddressAlreadyExistsError)
  })
})
