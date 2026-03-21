import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeClient } from 'test/factories/make-client'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryUserImagesRepository } from 'test/repositories/in-memory-user-images-repository'

import { ClientAlreadyExistsError } from '../errors/client-already-exists-error'
import { CreateClientUseCase } from './create-client'

let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryUserImagesRepository: InMemoryUserImagesRepository
let inMemoryClientsRepository: InMemoryClientsRepository
let fakeHasher: FakeHasher
let sut: CreateClientUseCase

describe('Register client use case', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryUserImagesRepository = new InMemoryUserImagesRepository()
    inMemoryClientsRepository = new InMemoryClientsRepository(
      inMemoryImagesRepository,
      inMemoryUserImagesRepository,
    )
    fakeHasher = new FakeHasher()
    sut = new CreateClientUseCase(
      inMemoryClientsRepository,
      fakeHasher,
      inMemoryImagesRepository,
      inMemoryUserImagesRepository,
    )
  })

  it('should be able to register a client', async () => {
    const result = await sut.execute({
      email: 'kemuel@gmail.com',
      name: 'Kemuel',
      birthDate: new Date('2000-01-01'),
      password: '123456',
      provider: 'email',
      imageUrl: 'http://example.com/image.jpg',
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      client: inMemoryClientsRepository.items[0],
    })
    expect(inMemoryImagesRepository.items).toHaveLength(1)
    expect(inMemoryUserImagesRepository.items).toHaveLength(1)
  })

  it('should not be able to register a client with same email twice', async () => {
    const client = makeClient({
      email: 'kemuellima20@gmail.com',
    })
    await inMemoryClientsRepository.create(client)

    const result = await sut.execute({
      email: 'kemuellima20@gmail.com',
      name: 'Kemuel',
      birthDate: new Date('2000-01-01'),
      password: '123456',
      provider: 'email',
      imageUrl: 'http://example.com/image.jpg',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ClientAlreadyExistsError)
  })
})
