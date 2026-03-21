import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CompanyDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/company-details'

import { CompaniesRepository } from '../repositories/companies-repository'

interface GetCompanyBySlugUseCaseRequest {
  slug: string
}

type GetCompanyBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    company: CompanyDetails
  }
>

@Injectable()
export class GetCompanyBySlugUseCase {
  constructor(private companiesRepository: CompaniesRepository) {}

  async execute({
    slug,
  }: GetCompanyBySlugUseCaseRequest): Promise<GetCompanyBySlugUseCaseResponse> {
    const company = await this.companiesRepository.findBySlug(slug)

    if (!company) {
      return failure(new ResourceNotFoundError('Company'))
    }

    return success({
      company,
    })
  }
}
