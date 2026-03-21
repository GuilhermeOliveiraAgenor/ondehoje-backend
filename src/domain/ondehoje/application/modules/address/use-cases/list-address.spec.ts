import { makeAddress } from 'test/factories/make-address'
import { makeClient } from 'test/factories/make-client'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'

import { ListAddressesUseCase } from './list-address'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let sut: ListAddressesUseCase

describe('List addresses use case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    sut = new ListAddressesUseCase(inMemoryAddressesRepository)
  })

  it(`should be able to list addresses`, async () => {
    const client = makeClient()
    const clientId = client.id.toString()

    const address1 = makeAddress({
      street: 'Rua A',
      createdBy: client.id,
    })
    await inMemoryAddressesRepository.create(address1)

    const address2 = makeAddress({
      street: 'Rua B',
      createdBy: client.id,
    })
    await inMemoryAddressesRepository.create(address2)

    const result = await sut.execute({
      userId: clientId,
    })

    expect(result.isSuccess()).toBe(true)
    if (result.isSuccess()) {
      expect(result.value.addresses).toHaveLength(2)
      expect(result.value.addresses).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ street: 'Rua A' }),
          expect.objectContaining({ street: 'Rua B' }),
        ]),
      )
    }
  })
})
