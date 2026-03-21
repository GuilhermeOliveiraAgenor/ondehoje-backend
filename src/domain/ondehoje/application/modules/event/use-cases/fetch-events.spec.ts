import { makeAddress } from 'test/factories/make-address'
import { makeCategory } from 'test/factories/make-category'
import { makeCompany } from 'test/factories/make-company'
import { makeEvent } from 'test/factories/make-event'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryCompanyDocumentsRepository } from 'test/repositories/in-memory-company-documents-repository'
import { InMemoryCompanyImagesRepository } from 'test/repositories/in-memory-company-images-repository'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-documents-repository'
import { InMemoryEventImagesRepository } from 'test/repositories/in-memory-event-images-repository'
import { InMemoryEventsRepository } from 'test/repositories/in-memory-events-repository'
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryInformationsRepository } from 'test/repositories/in-memory-informations-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { FetchEventsUseCase } from './fetch-events'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryDocumentsRepository: InMemoryDocumentsRepository
let inMemoryCompanyDocumentsRepository: InMemoryCompanyDocumentsRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryCompanyImagesRepository: InMemoryCompanyImagesRepository
let inMemoryInformationsRepository: InMemoryInformationsRepository
let inMemoryFavoritesRepository: InMemoryFavoritesRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryCategoriesRepository: InMemoryCategoriesRepository
let inMemoryEventImagesRepository: InMemoryEventImagesRepository
let inMemoryEventsRepository: InMemoryEventsRepository

let sut: FetchEventsUseCase

describe('List event', () => {
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
    inMemoryCategoriesRepository = new InMemoryCategoriesRepository()
    inMemoryEventImagesRepository = new InMemoryEventImagesRepository()
    inMemoryEventsRepository = new InMemoryEventsRepository(
      inMemoryCompaniesRepository,
      inMemoryAddressesRepository,
      inMemoryCategoriesRepository,
      inMemoryInformationsRepository,
      inMemoryImagesRepository,
      inMemoryEventImagesRepository,
    )

    sut = new FetchEventsUseCase(inMemoryEventsRepository)
  })

  it('should be able to list events', async () => {
    const address = makeAddress()
    await inMemoryAddressesRepository.create(address)

    const company = makeCompany({
      addressId: address.id,
    })
    await inMemoryCompaniesRepository.create(company)

    const eventAddress = makeAddress()
    await inMemoryAddressesRepository.create(eventAddress)

    const category = makeCategory()
    await inMemoryCategoriesRepository.create(category)

    const event = makeEvent({
      companyId: company.id,
      addressId: eventAddress.id,
      categoryId: category.id,
    })
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      latitude: 0,
      longitude: 0,
    })

    expect(result.value).toMatchObject({
      events: expect.arrayContaining([
        expect.objectContaining({
          name: event.name,
        }),
      ]),
    })
  })

  it('should be able to list events when there is no event', async () => {
    const result = await sut.execute({
      latitude: 0,
      longitude: 0,
    })

    expect(result.value).toMatchObject({
      events: expect.objectContaining([]),
    })
  })

  it('should not be able fetch deleted events', async () => {
    for (let i = 0; i < 3; i++) {
      const event = makeEvent({
        deletedAt: new Date(),
        deletedBy: new UniqueEntityID('user-id'),
      })
      await inMemoryEventsRepository.create(event)
    }

    const result = await sut.execute({
      latitude: 0,
      longitude: 0,
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      events: expect.objectContaining([]),
    })
    expect(inMemoryEventsRepository.items).toHaveLength(3)
  })
})
