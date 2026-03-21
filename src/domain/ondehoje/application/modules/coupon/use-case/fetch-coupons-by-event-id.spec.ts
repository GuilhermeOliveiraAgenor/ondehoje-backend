import { makeClient } from 'test/factories/make-client'
import { makeCompany } from 'test/factories/make-company'
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

import { FetchCouponsByEventIdUseCase } from './fetch-coupons-by-event-id'

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

let sut: FetchCouponsByEventIdUseCase

describe('Fetch Coupon by Event Id', () => {
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

    inMemoryUserCouponsRepository = new InMemoryUserCouponsRepository(
      inMemoryCouponsRepository,
      inMemoryEventsRepository,
    )

    inMemoryCouponsRepository = new InMemoryCouponsRepository(
      inMemoryEventsRepository,
      inMemoryCompaniesRepository,
      inMemoryUserCouponsRepository,
    )

    inMemoryUserCouponsRepository = new InMemoryUserCouponsRepository(
      inMemoryCouponsRepository,
      inMemoryEventsRepository,
    )

    sut = new FetchCouponsByEventIdUseCase(inMemoryCouponsRepository)
  })

  it('should be able to fetch coupons by event id', async () => {
    const client = makeClient()
    const clientId = client.id.toString()

    const company = makeCompany()
    await inMemoryCompaniesRepository.create(company)

    const event = makeEvent({
      companyId: company.id,
    })
    const eventId = event.id.toString()
    await inMemoryEventsRepository.create(event)

    const coupon = makeCoupon({
      name: '40% Off',
      eventId: event.id,
      expiresAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 24), // +1 day
    })
    await inMemoryCouponsRepository.create(coupon)

    const result = await sut.execute({
      eventId,
      userId: clientId,
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      coupons: expect.arrayContaining([
        expect.objectContaining({
          name: '40% Off',
        }),
      ]),
    })
  })
})
