import { makeCompany } from 'test/factories/make-company'
import { makeInformation } from 'test/factories/make-information'
import { InMemoryInformationsRepository } from 'test/repositories/in-memory-informations-repository'

import { FetchInformationByCompanyIdUseCase } from './fetch-information-by-company-id'

let inMemoryInformationRepository: InMemoryInformationsRepository
let sut: FetchInformationByCompanyIdUseCase

describe('Fetch Information by Company Id', () => {
  beforeEach(() => {
    inMemoryInformationRepository = new InMemoryInformationsRepository()

    sut = new FetchInformationByCompanyIdUseCase(inMemoryInformationRepository)
  })

  it('should be able to fetch Information by Company Id', async () => {
    const company = makeCompany()
    const companyId = company.id.toString()

    const information = makeInformation({
      companyId: company.id,
      name: 'Lista de informações',
    })
    await inMemoryInformationRepository.createMany([information])

    const result = await sut.execute({
      companyId,
    })

    expect(result.isSuccess()).toBe(true)
    expect(result.value).toMatchObject({
      informations: expect.arrayContaining([
        expect.objectContaining({
          name: 'Lista de informações',
          companyId: company.id,
        }),
      ]),
    })
  })
})
