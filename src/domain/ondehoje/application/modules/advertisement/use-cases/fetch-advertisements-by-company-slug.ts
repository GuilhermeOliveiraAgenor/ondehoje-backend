import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AdvertisementDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/advertisement-details'

import { CompaniesRepository } from '../../company/repositories/companies-repository'
import { AdvertisementsRepository } from '../repositories/advertisements-repository'

interface FetchAdvertisementsByCompanySlugUseCaseRequest {
  slug: string
  requestedBy: string
}

type FetchAdvertisementsByCompanySlugUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    advertisements: AdvertisementDetails[]
  }
>

@Injectable()
export class FetchAdvertisementsByCompanySlugUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private advertisementsRepository: AdvertisementsRepository,
  ) {}

  async execute({
    slug,
    requestedBy,
  }: FetchAdvertisementsByCompanySlugUseCaseRequest): Promise<FetchAdvertisementsByCompanySlugUseCaseResponse> {
    const company = await this.companiesRepository.findBySlug(slug)

    if (!company) {
      return failure(new ResourceNotFoundError('Company'))
    }

    if (company.createdBy.toString() !== requestedBy) {
      return failure(new NotAllowedError())
    }

    const advertisements =
      await this.advertisementsRepository.findManyByOwnerId(
        company.createdBy.toString(),
      )

    return success({
      advertisements,
    })
  }
}
