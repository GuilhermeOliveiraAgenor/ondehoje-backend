import { makeAdvertisement } from 'test/factories/make-advertisement'
import { makeIdentityDetails } from 'test/factories/make-identity-details'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryAdvertisementAuthorizationsRepository } from 'test/repositories/in-memory-advertisement-authorizations-repository'
import { InMemoryAdvertisementsRepository } from 'test/repositories/in-memory-advertisements-repository'
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
import { InMemoryPaymentsRepository } from 'test/repositories/in-memory-payments-repository'
import { InMemorySubscriptionsRepository } from 'test/repositories/in-memory-subscriptions-repository'

import { AdvertisementStatus } from '../enums/advertisement-status'
import { EvaluateAdvertisementUseCase } from './evaluate-advertisement'

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
let inMemoryAdvertisementsRepository: InMemoryAdvertisementsRepository
let inMemoryAdvertisementAuthorizationsRepository: InMemoryAdvertisementAuthorizationsRepository
let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository
let inMemoryPaymentsRepository: InMemoryPaymentsRepository

let sut: EvaluateAdvertisementUseCase

describe('Evaluate Advertisement Use Case', () => {
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

    inMemoryAdvertisementAuthorizationsRepository =
      new InMemoryAdvertisementAuthorizationsRepository()

    inMemoryAdvertisementsRepository = new InMemoryAdvertisementsRepository(
      inMemoryCompaniesRepository,
      inMemoryEventsRepository,
      inMemoryAdvertisementAuthorizationsRepository,
    )

    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()
    inMemoryPaymentsRepository = new InMemoryPaymentsRepository(
      inMemorySubscriptionsRepository,
      inMemoryAdvertisementsRepository,
    )

    sut = new EvaluateAdvertisementUseCase(
      inMemoryAdvertisementsRepository,
      inMemoryPaymentsRepository,
      inMemoryAdvertisementAuthorizationsRepository,
    )
  })

  it('should be able to evaluate an advertisement', async () => {
    const actor = makeIdentityDetails({
      permissions: new Set(['evaluate:Advertisement']),
    })

    const advertisement = makeAdvertisement()
    const advertisementId = advertisement.id.toString()
    await inMemoryAdvertisementsRepository.create(advertisement)

    const result = await sut.execute({
      advertisementId,
      approved: true,
      actor,
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryAdvertisementAuthorizationsRepository.items).toHaveLength(1)
    expect(inMemoryAdvertisementsRepository.items[0].status).toEqual(
      AdvertisementStatus.WAITING_PAYMENT,
    )
  })
})
