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

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { FetchEventsByCompanySlugUseCase } from './fetch-events-by-company-slug'

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

let sut: FetchEventsByCompanySlugUseCase

describe('List event by company id', () => {
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

    sut = new FetchEventsByCompanySlugUseCase(
      inMemoryEventsRepository,
      inMemoryCompaniesRepository,
    )
  })

  it('should be able to list events by company id', async () => {
    const address = makeAddress()
    await inMemoryAddressesRepository.create(address)

    const company = makeCompany({
      addressId: address.id,
    })
    await inMemoryCompaniesRepository.create(company)

    for (let i = 0; i < 2; i++) {
      const address = makeAddress()
      await inMemoryAddressesRepository.create(address)

      const category = makeCategory()
      await inMemoryCategoriesRepository.create(category)

      const event = makeEvent({
        companyId: company.id,
        addressId: address.id,
        categoryId: category.id,
      })
      await inMemoryEventsRepository.create(event)
    }

    const result = await sut.execute({
      slug: company.slug.value,
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      events: expect.objectContaining([
        expect.objectContaining({
          company: expect.objectContaining({ name: company.name }),
        }),
        expect.objectContaining({
          company: expect.objectContaining({ name: company.name }),
        }),
      ]),
    })
  })

  it('should be able to return an empty array if no events are found for the company', async () => {
    const address = makeAddress()
    await inMemoryAddressesRepository.create(address)

    const company = makeCompany({
      addressId: address.id,
    })
    await inMemoryCompaniesRepository.create(company)

    const category = makeCategory()
    await inMemoryCategoriesRepository.create(category)

    const event = makeEvent({
      addressId: address.id,
      categoryId: category.id,
    })
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({ slug: company.slug.value })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      events: expect.objectContaining([]),
    })
  })

  it('should not be able to return events if company not exists', async () => {
    const result = await sut.execute({
      slug: 'non-existent-company',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
