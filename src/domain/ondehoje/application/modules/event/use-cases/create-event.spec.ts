import { faker } from '@faker-js/faker'
import { makeAddress } from 'test/factories/make-address'
import { makeCategory } from 'test/factories/make-category'
import { makeCompany } from 'test/factories/make-company'
import { makeEvent } from 'test/factories/make-event'
import { makeInformation } from 'test/factories/make-information'
import { makeSubscription } from 'test/factories/make-subscription'
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
import { InMemorySubscriptionsRepository } from 'test/repositories/in-memory-subscriptions-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'

import { SubscriptionStatus } from '../../subscription/enum/subscription-status'
import { InactiveSubscriptionError } from '../../subscription/errors/inactive-subscription-error'
import { EventAlreadyExistsError } from '../errors/event-already-exists-error'
import { InvalidEventDateRangeError } from '../errors/invalid-event-date-range-error'
import { CreateEventUseCase } from './create-event'

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

let sut: CreateEventUseCase

describe('Create event use case', () => {
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

    sut = new CreateEventUseCase(
      inMemoryCompaniesRepository,
      inMemorySubscriptionsRepository,
      inMemoryAddressesRepository,
      inMemoryCategoriesRepository,
      inMemoryEventsRepository,
      inMemoryInformationsRepository,
    )
  })

  it('should be able to create a event', async () => {
    const addressCompany = makeAddress()
    await inMemoryAddressesRepository.create(addressCompany)

    const company = makeCompany({
      addressId: addressCompany.id,
    })
    await inMemoryCompaniesRepository.create(company)

    const subscription = makeSubscription({
      companyId: company.id,
      status: SubscriptionStatus.ACTIVE,
    })
    await inMemorySubscriptionsRepository.create(subscription)

    const address = makeAddress({ createdBy: new UniqueEntityID('user-1') })
    const addressId = address.id.toString()
    await inMemoryAddressesRepository.create(address)

    const category = makeCategory()
    const categoryId = category.id.toString()
    await inMemoryCategoriesRepository.create(category)

    const information = makeInformation()
    await inMemoryInformationsRepository.createMany([information])

    const startDate = faker.date.soon({ days: 10 })
    const endDate = new Date(startDate)
    endDate.setHours(endDate.getHours() + 2)

    const result = await sut.execute({
      companySlug: company.slug.value,
      addressId,
      categoryId,
      name: 'Event 1',
      description: 'Description 1',
      startDate,
      endDate,
      createdBy: 'user-1',
      imagesIds: ['image-1', 'image-2'],
    })

    const savedImages = await inMemoryEventImagesRepository.findManyByEventId(
      inMemoryEventsRepository.items[0].id.toString(),
    )
    expect(savedImages).toHaveLength(2)
    expect(savedImages.map((img) => img.imageId.toString())).toEqual([
      'image-1',
      'image-2',
    ])

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toEqual({
      event: inMemoryEventsRepository.items[0],
    })
    expect(inMemoryEventsRepository.items).toHaveLength(1)
    expect(inMemoryEventsRepository.items[0].name).toBe('Event 1')
    expect(inMemoryInformationsRepository.items).toHaveLength(1)
  })

  it('should not be able to create a event with same name twice', async () => {
    const addressCompany = makeAddress()
    await inMemoryAddressesRepository.create(addressCompany)

    const company = makeCompany({
      addressId: addressCompany.id,
    })
    await inMemoryCompaniesRepository.create(company)

    const subscription = makeSubscription({
      companyId: company.id,
      status: SubscriptionStatus.ACTIVE,
    })
    await inMemorySubscriptionsRepository.create(subscription)

    const address = makeAddress({ createdBy: new UniqueEntityID('user-2') })
    const addressId = address.id.toString()
    await inMemoryAddressesRepository.create(address)

    const category = makeCategory()
    const categoryId = category.id.toString()
    await inMemoryCategoriesRepository.create(category)

    const information = makeInformation()
    await inMemoryInformationsRepository.createMany([information])

    const event = makeEvent({
      companyId: company.id,
      name: 'Event 1',
    })
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      companySlug: company.slug.value,
      addressId,
      categoryId,
      name: 'Event 1',
      description: 'Description 2',
      startDate: new Date(),
      endDate: new Date(),
      createdBy: 'user-2',
      imagesIds: ['image-1', 'image-2'],
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(EventAlreadyExistsError)
  })

  it('should allow events with same name in different companies', async () => {
    const event = makeEvent()
    await inMemoryEventsRepository.create(event)

    const addressCompany = makeAddress()
    await inMemoryAddressesRepository.create(addressCompany)

    const company = makeCompany({
      addressId: addressCompany.id,
    })
    await inMemoryCompaniesRepository.create(company)

    const subscription = makeSubscription({
      companyId: company.id,
      status: SubscriptionStatus.ACTIVE,
    })
    await inMemorySubscriptionsRepository.create(subscription)

    const address = makeAddress({ createdBy: new UniqueEntityID('user-1') })
    const addressId = address.id.toString()
    await inMemoryAddressesRepository.create(address)

    const category = makeCategory()
    const categoryId = category.id.toString()
    await inMemoryCategoriesRepository.create(category)

    const information = makeInformation()
    await inMemoryInformationsRepository.createMany([information])

    const startDate = faker.date.soon({ days: 10 })
    const endDate = new Date(startDate)
    endDate.setHours(endDate.getHours() + 2)

    const result = await sut.execute({
      companySlug: company.slug.value,
      addressId,
      categoryId,
      name: 'Event 1',
      description: 'Description 1',
      startDate,
      endDate,
      createdBy: 'user-1',
      imagesIds: ['image-1', 'image-2'],
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryEventsRepository.items).toHaveLength(2)
  })

  it('should not be able to create an event if start date and end date are invalid', async () => {
    const addressCompany = makeAddress()
    await inMemoryAddressesRepository.create(addressCompany)

    const company = makeCompany({
      addressId: addressCompany.id,
    })
    await inMemoryCompaniesRepository.create(company)

    const subscription = makeSubscription({
      companyId: company.id,
      status: SubscriptionStatus.ACTIVE,
    })
    await inMemorySubscriptionsRepository.create(subscription)

    const address = makeAddress({ createdBy: new UniqueEntityID('user-1') })
    const addressId = address.id.toString()
    await inMemoryAddressesRepository.create(address)

    const category = makeCategory()
    const categoryId = category.id.toString()
    await inMemoryCategoriesRepository.create(category)

    const information = makeInformation()
    await inMemoryInformationsRepository.createMany([information])

    const result = await sut.execute({
      companySlug: company.slug.value,
      addressId,
      categoryId,
      name: 'Event 1',
      description: 'Description 1',
      startDate: new Date(),
      endDate: new Date(),
      createdBy: 'user-1',
      imagesIds: ['image-1', 'image-2'],
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidEventDateRangeError)
  })

  it('should not be able to create an event if company does not have an active subscription', async () => {
    const addressCompany = makeAddress()
    await inMemoryAddressesRepository.create(addressCompany)

    const company = makeCompany({
      addressId: addressCompany.id,
    })
    await inMemoryCompaniesRepository.create(company)

    const subscription = makeSubscription({
      companyId: company.id,
      status: SubscriptionStatus.CANCELED,
    })
    await inMemorySubscriptionsRepository.create(subscription)

    const address = makeAddress({ createdBy: new UniqueEntityID('user-1') })
    const addressId = address.id.toString()
    await inMemoryAddressesRepository.create(address)

    const category = makeCategory()
    const categoryId = category.id.toString()
    await inMemoryCategoriesRepository.create(category)

    const information = makeInformation()
    await inMemoryInformationsRepository.createMany([information])

    const startDate = faker.date.soon({ days: 10 })
    const endDate = new Date(startDate)
    endDate.setHours(endDate.getHours() + 2)

    const result = await sut.execute({
      companySlug: company.slug.value,
      addressId,
      categoryId,
      name: 'Event 1',
      description: 'Description 1',
      startDate,
      endDate,
      createdBy: 'user-1',
      imagesIds: ['image-1', 'image-2'],
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(InactiveSubscriptionError)
  })
})
