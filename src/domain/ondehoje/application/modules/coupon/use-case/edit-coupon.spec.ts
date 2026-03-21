import { makeCoupon } from 'test/factories/make-coupon'
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

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { EditCouponUseCase } from './edit-coupon'

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

let sut: EditCouponUseCase

describe('Edit Coupon', () => {
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

    sut = new EditCouponUseCase(inMemoryCouponsRepository)
  })

  it('should be able to edit coupon', async () => {
    const coupon = makeCoupon()
    await inMemoryCouponsRepository.create(coupon)

    const result = await sut.execute({
      id: coupon.id.toString(),
      name: '40% Off',
      description: 'Coupon 40% de desconto',
    })

    expect(result.isSuccess()).toBe(true)
    expect(inMemoryCouponsRepository.items).toHaveLength(1)
    if (result.isSuccess()) {
      expect(result.value.coupon).toMatchObject({
        name: '40% Off',
      })
    }
  })

  it('should be not able to edit coupon with id not exists', async () => {
    const coupon = makeCoupon()
    await inMemoryCouponsRepository.create(coupon)

    const result = await sut.execute({
      id: '0',
      name: '40% Off',
      description: 'Coupon 40% de desconto',
    })

    expect(result.isError()).toBe(true)
    expect(inMemoryCouponsRepository.items).toHaveLength(1)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
