import { makeAddress } from 'test/factories/make-address'
import { makeCompany } from 'test/factories/make-company'
import { makeSubscription } from 'test/factories/make-subscription'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryCompanyDocumentsRepository } from 'test/repositories/in-memory-company-documents-repository'
import { InMemoryCompanyImagesRepository } from 'test/repositories/in-memory-company-images-repository'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-documents-repository'
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryInformationsRepository } from 'test/repositories/in-memory-informations-repository'
import { InMemorySubscriptionsRepository } from 'test/repositories/in-memory-subscriptions-repository'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { GetSubscriptionByCompanySlugUseCase } from './get-subscription-by-company-slug'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryDocumentsRepository: InMemoryDocumentsRepository
let inMemoryCompanyDocumentsRepository: InMemoryCompanyDocumentsRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryCompanyImagesRepository: InMemoryCompanyImagesRepository
let inMemoryInformationsRepository: InMemoryInformationsRepository
let inMemoryFavoritesRepository: InMemoryFavoritesRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository

let sut: GetSubscriptionByCompanySlugUseCase

describe('Get Subscription By Id Use Case', () => {
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

    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()

    sut = new GetSubscriptionByCompanySlugUseCase(
      inMemoryCompaniesRepository,
      inMemorySubscriptionsRepository,
    )
  })

  it('should be able to get a subscription by company id', async () => {
    const address = makeAddress()
    await inMemoryAddressesRepository.create(address)

    const company = makeCompany({
      addressId: address.id,
    })
    await inMemoryCompaniesRepository.create(company)

    const subscription = makeSubscription({
      companyId: company.id,
    })
    await inMemorySubscriptionsRepository.create(subscription)

    const result = await sut.execute({
      slug: company.slug.value,
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      subscription: expect.objectContaining({
        companyId: expect.any(UniqueEntityID),
      }),
    })
  })

  it('should not be able to get a subscription with invalid company id', async () => {
    const result = await sut.execute({
      slug: 'invalid-slug',
    })

    expect(result.isError()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
