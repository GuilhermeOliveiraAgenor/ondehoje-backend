import { faker } from '@faker-js/faker'
import { makeAddress } from 'test/factories/make-address'
import { makeClient } from 'test/factories/make-client'
import { makeDocument } from 'test/factories/make-document'
import { makeImage } from 'test/factories/make-image'
import { makeInformation } from 'test/factories/make-information'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryClientsRepository } from 'test/repositories/in-memory-clients-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryCompanyDocumentsRepository } from 'test/repositories/in-memory-company-documents-repository'
import { InMemoryCompanyImagesRepository } from 'test/repositories/in-memory-company-images-repository'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-documents-repository'
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryInformationsRepository } from 'test/repositories/in-memory-informations-repository'
import { InMemorySubscriptionsRepository } from 'test/repositories/in-memory-subscriptions-repository'
import { InMemoryUserImagesRepository } from 'test/repositories/in-memory-user-images-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { CreateCompanyUseCase } from './create-company'

let inMemoryUserImagesRepository: InMemoryUserImagesRepository
let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryDocumentsRepository: InMemoryDocumentsRepository
let inMemoryCompanyDocumentsRepository: InMemoryCompanyDocumentsRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryCompanyImagesRepository: InMemoryCompanyImagesRepository
let inMemoryInformationsRepository: InMemoryInformationsRepository
let inMemoryFavoritesRepository: InMemoryFavoritesRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository

let sut: CreateCompanyUseCase

describe('Create company use case', () => {
  beforeEach(() => {
    inMemoryAddressesRepository = new InMemoryAddressesRepository()
    inMemoryDocumentsRepository = new InMemoryDocumentsRepository()
    inMemoryCompanyDocumentsRepository =
      new InMemoryCompanyDocumentsRepository()
    inMemoryImagesRepository = new InMemoryImagesRepository()
    inMemoryCompanyImagesRepository = new InMemoryCompanyImagesRepository()
    inMemoryInformationsRepository = new InMemoryInformationsRepository()
    inMemoryFavoritesRepository = new InMemoryFavoritesRepository()
    inMemoryCompaniesRepository = new InMemoryCompaniesRepository(
      inMemoryAddressesRepository,
      inMemoryDocumentsRepository,
      inMemoryCompanyDocumentsRepository,
      inMemoryImagesRepository,
      inMemoryCompanyImagesRepository,
      inMemoryInformationsRepository,
      inMemoryFavoritesRepository,
    )

    inMemoryUserImagesRepository = new InMemoryUserImagesRepository()
    inMemoryClientsRepository = new InMemoryClientsRepository(
      inMemoryImagesRepository,
      inMemoryUserImagesRepository,
    )

    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()
    inMemoryInformationsRepository = new InMemoryInformationsRepository()

    sut = new CreateCompanyUseCase(
      inMemoryAddressesRepository,
      inMemoryClientsRepository,
      inMemoryCompaniesRepository,
      inMemorySubscriptionsRepository,
      inMemoryInformationsRepository,
    )
  })

  it('should be able to create a new company', async () => {
    const user = makeClient()
    await inMemoryClientsRepository.create(user)

    const address = makeAddress({
      createdBy: user.id,
    })
    await inMemoryAddressesRepository.create(address)

    const document = makeDocument({ name: 'Alvará' })
    await inMemoryDocumentsRepository.createMany([document])

    const image = makeImage()
    await inMemoryImagesRepository.createMany([image])

    const information = makeInformation()
    await inMemoryInformationsRepository.createMany([information])

    const result = await sut.execute({
      addressId: address.id.toString(),
      documentsIds: [document.id.toString()],
      imagesIds: [image.id.toString()],
      document: faker.company.name(),
      name: faker.company.name(),
      socialName: faker.company.name(),
      createdBy: user.id,
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryCompaniesRepository.items).toHaveLength(1)
    expect(inMemoryCompanyDocumentsRepository.items).toHaveLength(1)
    expect(inMemoryCompanyImagesRepository.items).toHaveLength(1)
    expect(inMemoryInformationsRepository.items).toHaveLength(1)
  })

  it('should not be able to create a new company if address does not exist', async () => {
    const user = makeClient()
    await inMemoryClientsRepository.create(user)

    const document = makeDocument({ name: 'Alvará' })
    await inMemoryDocumentsRepository.createMany([document])

    const image = makeImage()
    await inMemoryImagesRepository.createMany([image])

    const information = makeInformation()
    await inMemoryInformationsRepository.createMany([information])

    const result = await sut.execute({
      addressId: 'address.id.toString()',
      documentsIds: [document.id.toString()],
      imagesIds: [image.id.toString()],
      document: faker.company.name(),
      name: faker.company.name(),
      socialName: faker.company.name(),
      createdBy: user.id,
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(result.value).toMatchObject({
      message: 'Address not found.',
    })
  })

  it('should not be able to create a new company if user does not exist', async () => {
    const address = makeAddress()
    await inMemoryAddressesRepository.create(address)

    const document = makeDocument({ name: 'Alvará' })
    await inMemoryDocumentsRepository.createMany([document])

    const image = makeImage()
    await inMemoryImagesRepository.createMany([image])

    const information = makeInformation()
    await inMemoryInformationsRepository.createMany([information])

    const result = await sut.execute({
      addressId: address.id.toString(),
      documentsIds: [document.id.toString()],
      imagesIds: [image.id.toString()],
      document: faker.company.name(),
      name: faker.company.name(),
      socialName: faker.company.name(),
      createdBy: new UniqueEntityID(),
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    expect(result.value).toMatchObject({
      message: 'Client not found.',
    })
  })

  it('should not be able to create a new company if address not belongs to client', async () => {
    const user = makeClient()
    await inMemoryClientsRepository.create(user)

    const address = makeAddress()
    await inMemoryAddressesRepository.create(address)

    const document = makeDocument({ name: 'Alvará' })
    await inMemoryDocumentsRepository.createMany([document])

    const image = makeImage()
    await inMemoryImagesRepository.createMany([image])

    const information = makeInformation()
    await inMemoryInformationsRepository.createMany([information])

    const result = await sut.execute({
      addressId: address.id.toString(),
      documentsIds: [document.id.toString()],
      imagesIds: [image.id.toString()],
      document: faker.company.name(),
      name: faker.company.name(),
      socialName: faker.company.name(),
      createdBy: user.id,
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
