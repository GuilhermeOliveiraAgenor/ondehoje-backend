import { makeAddress } from 'test/factories/make-address'
import { makeClient } from 'test/factories/make-client'
import { makeCompany } from 'test/factories/make-company'
import { makeEvent } from 'test/factories/make-event'
import { makeParameter } from 'test/factories/make-parameter'
import { makeSubscription } from 'test/factories/make-subscription'
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
import { InMemorySubscriptionsRepository } from 'test/repositories/in-memory-subscriptions-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { InactiveSubscriptionError } from '../../subscription/errors/inactive-subscription-error'
import { CreateAdvertisementUseCase } from './create-advertisement'

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
let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository
let inMemoryParametersRepository: InMemoryParametersRepository
let inMemoryAdvertisementsRepository: InMemoryAdvertisementsRepository

let sut: CreateAdvertisementUseCase

describe('Create Advertisement Use Case', () => {
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

    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()
    inMemoryParametersRepository = new InMemoryParametersRepository()
    inMemoryAdvertisementsRepository = new InMemoryAdvertisementsRepository(
      inMemoryCompaniesRepository,
      inMemoryEventsRepository,
    )

    sut = new CreateAdvertisementUseCase(
      inMemoryCompaniesRepository,
      inMemoryEventsRepository,
      inMemorySubscriptionsRepository,
      inMemoryParametersRepository,
      inMemoryAdvertisementsRepository,
    )
  })

  it('should be able to create an advertisement for a company', async () => {
    const client = makeClient()

    const address = makeAddress()
    await inMemoryAddressesRepository.create(address)

    const company = makeCompany({
      addressId: address.id,
    })
    await inMemoryCompaniesRepository.create(company)

    const subscription = makeSubscription({
      companyId: company.id,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    })
    await inMemorySubscriptionsRepository.create(subscription)

    const baseDailyPriceParameter = makeParameter({
      key: 'advertisement.base.daily.price',
      value: '10',
    })

    const discountThresholdDaysParameter = makeParameter({
      key: 'advertisement.discount.threshold.days',
      value: '10',
    })

    const discountPercentageParameter = makeParameter({
      key: 'advertisement.discount.percentage',
      value: '10',
    })

    await inMemoryParametersRepository.create(baseDailyPriceParameter)
    await inMemoryParametersRepository.create(discountThresholdDaysParameter)
    await inMemoryParametersRepository.create(discountPercentageParameter)

    const result = await sut.execute({
      companySlug: company.slug.value,
      description: 'Advertisement Description',
      days: 10,
      createdBy: client.id,
    })

    expect(result.isSuccess()).toBe(true)

    expect(inMemoryAdvertisementsRepository.items).toHaveLength(1)
    expect(inMemoryAdvertisementsRepository.items[0]).toMatchObject({
      companyId: company.id,
      description: 'Advertisement Description',
      days: 10,
      amount: 9000, // 10 * 10 days - 10% discount
    })
  })

  it('should be able to create an advertisement for an event', async () => {
    const client = makeClient()

    const address = makeAddress()
    await inMemoryAddressesRepository.create(address)

    const company = makeCompany({
      addressId: address.id,
    })
    await inMemoryCompaniesRepository.create(company)

    const event = makeEvent({
      companyId: company.id,
    })
    await inMemoryEventsRepository.create(event)

    const subscription = makeSubscription({
      companyId: company.id,
      startDate: new Date(),
      endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    })
    await inMemorySubscriptionsRepository.create(subscription)

    const baseDailyPriceParameter = makeParameter({
      key: 'advertisement.base.daily.price',
      value: '10',
    })

    const discountThresholdDaysParameter = makeParameter({
      key: 'advertisement.discount.threshold.days',
      value: '10',
    })

    const discountPercentageParameter = makeParameter({
      key: 'advertisement.discount.percentage',
      value: '20',
    })

    await inMemoryParametersRepository.create(baseDailyPriceParameter)
    await inMemoryParametersRepository.create(discountThresholdDaysParameter)
    await inMemoryParametersRepository.create(discountPercentageParameter)

    const result = await sut.execute({
      companySlug: company.slug.value,
      eventSlug: event.slug.value,
      description: 'Advertisement Description',
      days: 10,
      createdBy: client.id,
    })

    expect(result.isSuccess()).toBe(true)

    expect(inMemoryAdvertisementsRepository.items).toHaveLength(1)
    expect(inMemoryAdvertisementsRepository.items[0]).toMatchObject({
      eventId: event.id,
      description: 'Advertisement Description',
      days: 10,
      amount: 8000, // 10 * 10 days - 20% discount
    })
  })

  it('should not be able to create any advertisement without company', async () => {
    const client = makeClient()

    const result = await sut.execute({
      companySlug: '3123',
      description: 'Advertisement Description',
      days: 10,
      createdBy: client.id,
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create an advertisement without subscription', async () => {
    const client = makeClient()

    const address = makeAddress()
    await inMemoryAddressesRepository.create(address)

    const company = makeCompany({
      addressId: address.id,
    })
    await inMemoryCompaniesRepository.create(company)

    const result = await sut.execute({
      companySlug: company.slug.value,
      description: 'Advertisement Description',
      days: 10,
      createdBy: client.id,
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create an advertisement with inactive subscription', async () => {
    const client = makeClient()

    const address = makeAddress()
    await inMemoryAddressesRepository.create(address)

    const company = makeCompany({
      addressId: address.id,
    })
    await inMemoryCompaniesRepository.create(company)

    const subscription = makeSubscription({
      companyId: company.id,
      startDate: new Date(new Date().setDate(new Date().getDate() - 40)),
      endDate: new Date(new Date().setDate(new Date().getDate() - 10)),
    })
    await inMemorySubscriptionsRepository.create(subscription)

    const result = await sut.execute({
      companySlug: company.slug.value,
      description: 'Advertisement Description',
      days: 10,
      createdBy: client.id,
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(InactiveSubscriptionError)
  })
})
