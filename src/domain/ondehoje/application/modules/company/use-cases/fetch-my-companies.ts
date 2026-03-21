import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { Company } from '@/domain/ondehoje/enterprise/entities/company'

import { CompaniesRepository } from '../repositories/companies-repository'

interface FetchMyCompaniesUseCaseRequest {
  requestedBy: string
}

type FetchMyCompaniesUseCaseResponse = Either<
  null,
  {
    companies: Company[]
  }
>

@Injectable()
export class FetchMyCompaniesUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    requestedBy,
  }: FetchMyCompaniesUseCaseRequest): Promise<FetchMyCompaniesUseCaseResponse> {
    const companies =
      await this.companiesRepository.findManyByOwnerId(requestedBy)

    return success({
      companies,
    })
  }
}
