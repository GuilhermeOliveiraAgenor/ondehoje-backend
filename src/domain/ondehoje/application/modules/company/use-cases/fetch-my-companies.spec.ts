import { makeClient } from 'test/factories/make-client'
import { makeCompany } from 'test/factories/make-company'
import { InMemoryAddressesRepository } from 'test/repositories/in-memory-addresses-repository'
import { InMemoryCompaniesRepository } from 'test/repositories/in-memory-companies-repository'
import { InMemoryCompanyDocumentsRepository } from 'test/repositories/in-memory-company-documents-repository'
import { InMemoryCompanyImagesRepository } from 'test/repositories/in-memory-company-images-repository'
import { InMemoryDocumentsRepository } from 'test/repositories/in-memory-documents-repository'
import { InMemoryFavoritesRepository } from 'test/repositories/in-memory-favorites-repository'
import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { InMemoryInformationsRepository } from 'test/repositories/in-memory-informations-repository'

import { FetchMyCompaniesUseCase } from './fetch-my-companies'

let inMemoryAddressesRepository: InMemoryAddressesRepository
let inMemoryDocumentsRepository: InMemoryDocumentsRepository
let inMemoryCompanyDocumentsRepository: InMemoryCompanyDocumentsRepository
let inMemoryImagesRepository: InMemoryImagesRepository
let inMemoryCompanyImagesRepository: InMemoryCompanyImagesRepository
let inMemoryInformationsRepository: InMemoryInformationsRepository
let inMemoryFavoritesRepository: InMemoryFavoritesRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository

let sut: FetchMyCompaniesUseCase

describe('Fetch companies use case', () => {
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

    sut = new FetchMyCompaniesUseCase(inMemoryCompaniesRepository)
  })

  it('should be able to fetch companies by owner id', async () => {
    const owner = makeClient()
    const ownerId = owner.id.toString()

    const company = makeCompany({
      createdBy: owner.id,
    })
    await inMemoryCompaniesRepository.create(company)

    const result = await sut.execute({
      requestedBy: ownerId,
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      companies: expect.arrayContaining([
        expect.objectContaining({
          id: company.id,
        }),
      ]),
    })
  })
})
