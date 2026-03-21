import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { CompanyDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/company-details'

import { CompaniesRepository } from '../repositories/companies-repository'

interface FetchCompaniesForUserUseCaseRequest {
  userId: string
  latitude?: number
  longitude?: number
}

type FetchCompaniesForUserUseCaseResponse = Either<
  null,
  {
    companies: CompanyDetails[]
  }
>

@Injectable()
export class FetchCompaniesForUserUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    userId,
    latitude,
    longitude,
  }: FetchCompaniesForUserUseCaseRequest): Promise<FetchCompaniesForUserUseCaseResponse> {
    const companies = await this.companiesRepository.findManyForUser(userId, {
      latitude,
      longitude,
    })

    return success({
      companies,
    })
  }
}
