import { makeAddress } from 'test/factories/make-address'
import { makeCategory } from 'test/factories/make-category'
import { makeCompany } from 'test/factories/make-company'
import { makeEvent } from 'test/factories/make-event'
import { makeEventImage } from 'test/factories/make-event-image'
import { makeImage } from 'test/factories/make-image'
import { makeInformation } from 'test/factories/make-information'
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

import { GetEventBySlugUseCase } from './get-event-by-slug'

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

let sut: GetEventBySlugUseCase

describe('Get event by slug', () => {
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

    sut = new GetEventBySlugUseCase(inMemoryEventsRepository)
  })

  it('should be able to get event by slug', async () => {
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
      categoryId: category.id,
      addressId: eventAddress.id,
    })
    await inMemoryEventsRepository.create(event)

    const information = makeInformation({ eventId: event.id })
    await inMemoryInformationsRepository.createMany([information])

    const image = makeImage()
    await inMemoryImagesRepository.createMany([image])

    const eventImage = makeEventImage({
      imageId: image.id,
      eventId: event.id,
    })
    await inMemoryEventImagesRepository.createMany([eventImage])

    const result = await sut.execute({
      slug: event.slug.value,
    })

    expect(result.isSuccess()).toBe(true)

    expect(result.value).toEqual({
      event: expect.objectContaining({
        company: expect.objectContaining({
          id: company.id,
        }),
        category: expect.objectContaining({
          id: category.id,
        }),
        images: expect.arrayContaining([
          expect.objectContaining({ id: image.id }),
        ]),
      }),
    })
  })

  it('should not be able to get event by slug if event does not exist', async () => {
    const result = await sut.execute({
      slug: 'non-existing-slug',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
