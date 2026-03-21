import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { CompanyDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/company-details'

import { CompaniesRepository } from '../repositories/companies-repository'

interface FetchCompaniesUseCaseRequest {
  latitude?: number
  longitude?: number
}

type FetchCompaniesUseCaseResponse = Either<
  null,
  {
    companies: CompanyDetails[]
  }
>

@Injectable()
export class FetchCompaniesUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    latitude,
    longitude,
  }: FetchCompaniesUseCaseRequest): Promise<FetchCompaniesUseCaseResponse> {
    const companies = await this.companiesRepository.findMany({
      latitude,
      longitude,
    })

    return success({
      companies,
    })
  }
}
