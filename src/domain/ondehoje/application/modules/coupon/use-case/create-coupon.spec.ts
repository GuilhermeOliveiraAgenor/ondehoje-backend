import { makeCompany } from 'test/factories/make-company'
import { makeEvent } from 'test/factories/make-event'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryCategoriesRepository } from 'test/repositories/in-memory-categories-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryCompanyDocumentsRepository } from 'test/repositories/in-memory-company-documents-repository'
import { InMemoryCompanyImagesRepository } from 'test/repositories/in-memory-company-images-repository'
import { InMemoryCouponsRepository } from 'test/repositories/in-memory-coupons-repository'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-documents-repository'
import { InMemoryEventImagesRepository } from 'test/repositories/in-memory-event-images-repository'
import { InMemoryEventsRepository } from 'test/repositories/in-memory-events-repository'
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryInformationsRepository } from 'test/repositories/in-memory-informations-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { CreateCouponUseCase } from './create-coupon'

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
let inMemoryCouponsRepository: InMemoryCouponsRepository

let sut: CreateCouponUseCase

describe('Register Coupon', () => {
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

    inMemoryCouponsRepository = new InMemoryCouponsRepository(
      inMemoryEventsRepository,
      inMemoryCompaniesRepository,
    )

    sut = new CreateCouponUseCase(
      inMemoryCouponsRepository,
      inMemoryEventsRepository,
    )
  })

  it('should be able to register coupon', async () => {
    const company = makeCompany()
    await inMemoryCompaniesRepository.create(company)

    const event = makeEvent()
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      eventId: event.id.toString(),
      name: '50% Off',
      description: 'Coupon de desconto',
      expiresAt: new Date(),
      createdBy: new UniqueEntityID().toString(),
    })

    expect(inMemoryCompaniesRepository.items).toHaveLength(1)
    expect(inMemoryEventsRepository.items).toHaveLength(1)
    expect(result.isSuccess()).toBe(true)
    expect(inMemoryCouponsRepository.items).toHaveLength(1)
    if (result.isSuccess()) {
      expect(result.value.coupon).toMatchObject({
        name: '50% Off',
      })
    }
  })

  it('should be able to register coupon with only event', async () => {
    const event = makeEvent()
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      eventId: event.id.toString(),
      name: '50% Off',
      description: 'Coupon de desconto',
      expiresAt: new Date(),
      createdBy: new UniqueEntityID().toString(),
    })

    expect(inMemoryCompaniesRepository.items).toHaveLength(0)
    expect(inMemoryEventsRepository.items).toHaveLength(1)
    expect(result.isSuccess()).toBe(true)
    expect(inMemoryCouponsRepository.items).toHaveLength(1)
    if (result.isSuccess()) {
      expect(result.value.coupon).toMatchObject({
        name: '50% Off',
      })
    }
  })

  it('should be not able to register coupon with event not exists', async () => {
    const event = makeEvent()
    await inMemoryEventsRepository.create(event)

    const result = await sut.execute({
      eventId: '0',
      name: '50% Off',
      description: 'Coupon de desconto',
      expiresAt: new Date(),
      createdBy: new UniqueEntityID().toString(),
    })

    expect(inMemoryEventsRepository.items).toHaveLength(1)
    expect(result.isError()).toBe(true)
    expect(inMemoryCouponsRepository.items).toHaveLength(0)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
