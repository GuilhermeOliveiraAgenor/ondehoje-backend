import { FakeHasher } from 'test/cryptography/fake-hasher'
import { makeClient } from 'test/factories/make-client'
import { makeImage } from 'test/factories/make-image'
import { makeUserImage } from 'test/factories/make-user-image'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryUserImagesRepository } from 'test/repositories/in-memory-user-images-repository'

import { ClientNotFoundError } from '../errors/client-not-found-error'
import { EditClientUseCase } from './edit-client'

let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryUserImagesRepository: InMemoryUserImagesRepository
let inMemoryClientsRepository: InMemoryClientsRepository
let fakeHasher: FakeHasher
let sut: EditClientUseCase

describe('Edit client use case', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryUserImagesRepository = new InMemoryUserImagesRepository()
    inMemoryClientsRepository = new InMemoryClientsRepository(
      inMemoryImagesRepository,
      inMemoryUserImagesRepository,
    )
    fakeHasher = new FakeHasher()
    sut = new EditClientUseCase(inMemoryClientsRepository, fakeHasher)
  })

  it('should be able to edit a client', async () => {
    const client = makeClient({
      email: 'kemuel@gmail.com',
      name: 'Kemuel Batista',
      birthDate: new Date('2000-01-01'),
      password: '123456',
    })
    inMemoryClientsRepository.create(client)

    const image = makeImage()
    await inMemoryImagesRepository.createMany([image])

    const userImage = makeUserImage({
      imageId: image.id,
      userId: client.id,
    })
    await inMemoryUserImagesRepository.createMany([userImage])

    const result = await sut.execute({
      clientId: client.id.toString(),
      birthDate: new Date('2003-07-28'),
      email: 'kemuel2@gmail.com',
      name: 'Kemuel',
      password: '789456',
    })

    const hashedPassword = await fakeHasher.hash('789456')

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryClientsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          birthDate: new Date('2003-07-28'),
          email: 'kemuel2@gmail.com',
          name: 'Kemuel',
          password: hashedPassword,
        }),
      ]),
    )
  })

  it('should not be able to edit a non existing client', async () => {
    const result = await sut.execute({
      clientId: '1',
      birthDate: new Date('2003-07-28'),
      email: 'kemuel2@gmail.com',
      name: 'Kemuel',
      password: '789456',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ClientNotFoundError)
  })
})
