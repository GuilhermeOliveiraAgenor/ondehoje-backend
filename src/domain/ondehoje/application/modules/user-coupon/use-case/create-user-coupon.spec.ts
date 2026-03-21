import { makeClient } from 'test/factories/make-client'
import { makeCoupon } from 'test/factories/make-coupon'
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
import { InMemoryUserCouponsRepository } from 'test/repositories/in-memory-user-coupons-repository'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { CreateUserCouponUseCase } from './create-user-coupon'

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
let inMemoryUserCouponsRepository: InMemoryUserCouponsRepository

let sut: CreateUserCouponUseCase

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

    inMemoryUserCouponsRepository = new InMemoryUserCouponsRepository(
      inMemoryCouponsRepository,
      inMemoryEventsRepository,
    )

    sut = new CreateUserCouponUseCase(
      inMemoryCouponsRepository,
      inMemoryUserCouponsRepository,
    )
  })

  it('should be able to register user coupon', async () => {
    const event = makeEvent()
    await inMemoryEventsRepository.create(event)

    const coupon = makeCoupon({
      eventId: event.id,
      expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // +1 day
    })
    await inMemoryCouponsRepository.create(coupon)

    const client = makeClient()

    const result = await sut.execute({
      couponId: coupon.id.toString(),
      userId: client.id.toString(),
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryCouponsRepository.items).toHaveLength(1)
    expect(inMemoryUserCouponsRepository.items).toHaveLength(1)
    expect(inMemoryUserCouponsRepository.items[0]).toMatchObject({
      couponId: coupon.id,
      userId: client.id,
    })
  })

  it('should not be able to register coupon with coupon id not exists', async () => {
    const client = makeClient()

    const result = await sut.execute({
      couponId: '0',
      userId: client.id.toString(),
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
