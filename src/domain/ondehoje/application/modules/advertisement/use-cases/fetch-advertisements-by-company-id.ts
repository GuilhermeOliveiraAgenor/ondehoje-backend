import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AdvertisementDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/advertisement-details'

import { CompaniesRepository } from '../../company/repositories/companies-repository'
import { AdvertisementsRepository } from '../repositories/advertisements-repository'

interface FetchAdvertisementsByCompanyIdUseCaseRequest {
  companyId: string
}

type FetchAdvertisementsByCompanyIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    advertisements: AdvertisementDetails[]
  }
>

@Injectable()
export class FetchAdvertisementsByCompanyIdUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private advertisementsRepository: AdvertisementsRepository,
  ) {}

  async execute({
    companyId,
  }: FetchAdvertisementsByCompanyIdUseCaseRequest): Promise<FetchAdvertisementsByCompanyIdUseCaseResponse> {
    const event = await this.companiesRepository.findById(companyId)

    if (!event) {
      return failure(new ResourceNotFoundError('Event'))
    }

    const advertisements =
      await this.advertisementsRepository.findManyByCompanyId(companyId)

    return success({
      advertisements,
    })
  }
}
