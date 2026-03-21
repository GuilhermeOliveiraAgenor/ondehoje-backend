import { makeParameter } from 'test/factories/make-parameter'
import { makeSubscription } from 'test/factories/make-subscription'
import { FakePaymentGateway } from 'test/gateways/fake-payment-gateway'
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
import { InMemoryParametersRepository } from 'test/repositories/in-memory-parameters-repository'
import { InMemoryPaymentsRepository } from 'test/repositories/in-memory-payments-repository'
import { InMemorySubscriptionsRepository } from 'test/repositories/in-memory-subscriptions-repository'
import { waitFor } from 'test/utils/wait-for'
import { MockInstance } from 'vitest'

import { SubscriptionStatus } from '@/domain/ondehoje/application/modules/subscription/enum/subscription-status'

import {
  CreatePaymentUseCase,
  CreatePaymentUseCaseRequest,
  CreatePaymentUseCaseResponse,
} from '../use-cases/create-payment'
import { OnSubscriptionRenewed } from './on-subscription-renewed'

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
let inMemoryParametersRepository: InMemoryParametersRepository
let inMemoryPaymentsRepository: InMemoryPaymentsRepository
let fakePaymentGateway: FakePaymentGateway
let createPaymentUseCase: CreatePaymentUseCase

let createPaymentExecuteSpy: MockInstance<
  (
    request: CreatePaymentUseCaseRequest,
  ) => Promise<CreatePaymentUseCaseResponse>
>

describe('On subscription renewed subscriber', () => {
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
    inMemoryParametersRepository = new InMemoryParametersRepository()
    inMemoryPaymentsRepository = new InMemoryPaymentsRepository(
      inMemorySubscriptionsRepository,
      inMemoryAdvertisementsRepository,
    )
    fakePaymentGateway = new FakePaymentGateway()

    createPaymentUseCase = new CreatePaymentUseCase(
      inMemoryPaymentsRepository,
      fakePaymentGateway,
    )

    createPaymentExecuteSpy = vi.spyOn(createPaymentUseCase, 'execute')

    new OnSubscriptionRenewed(
      inMemoryParametersRepository,
      createPaymentUseCase,
    )
  })

  it('should be able to create a new payment when subscription has changed', async () => {
    const subscription = makeSubscription()
    await inMemorySubscriptionsRepository.create(subscription)

    const parameter = makeParameter({
      key: 'subscription.price',
      value: '100',
    })
    await inMemoryParametersRepository.create(parameter)

    // Change subscription end date to trigger the event
    subscription.status = SubscriptionStatus.PENDING
    await inMemorySubscriptionsRepository.save(subscription)

    await waitFor(() => {
      expect(createPaymentExecuteSpy).toHaveBeenCalled()
    })
  })
})
