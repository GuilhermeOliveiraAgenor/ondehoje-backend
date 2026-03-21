import { makePayment } from 'test/factories/make-payment'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
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

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { PaymentProvider } from '../enums/payment-provider'
import { FetchPaymentsByAdvertisementIdUseCase } from './fetch-payments-by-advertisement-id'

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
let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository
let inMemoryPaymentsRepository: InMemoryPaymentsRepository

let sut: FetchPaymentsByAdvertisementIdUseCase

describe('Fetch Payments By Advertisement Id Use Case', () => {
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

    inMemoryAdvertisementsRepository = new InMemoryAdvertisementsRepository(
      inMemoryCompaniesRepository,
      inMemoryEventsRepository,
    )

    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()

    inMemoryPaymentsRepository = new InMemoryPaymentsRepository(
      inMemorySubscriptionsRepository,
      inMemoryAdvertisementsRepository,
    )

    sut = new FetchPaymentsByAdvertisementIdUseCase(inMemoryPaymentsRepository)
  })

  it('should be able to fetch payments by advertisement id', async () => {
    for (let i = 0; i < 3; i++) {
      await inMemoryPaymentsRepository.create(
        makePayment({
          advertisementId: new UniqueEntityID('advertisement-id'),
        }),
      )
    }

    const result = await sut.execute({
      advertisementId: 'advertisement-id',
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryPaymentsRepository.items).toHaveLength(3)

    expect(result.value).toMatchObject({
      payments: expect.arrayContaining([
        expect.objectContaining({
          advertisementId: new UniqueEntityID('advertisement-id'),
          gateway: PaymentProvider.STRIPE,
          amount: expect.any(Number),
        }),
        expect.objectContaining({
          advertisementId: new UniqueEntityID('advertisement-id'),
          gateway: PaymentProvider.STRIPE,
          amount: expect.any(Number),
        }),
        expect.objectContaining({
          advertisementId: new UniqueEntityID('advertisement-id'),
          gateway: PaymentProvider.STRIPE,
          amount: expect.any(Number),
        }),
      ]),
    })
  })
})
