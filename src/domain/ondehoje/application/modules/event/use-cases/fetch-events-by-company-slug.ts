import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EventDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/event-details'

import { CompaniesRepository } from '../../company/repositories/companies-repository'
import { EventsRepository } from '../repositories/events-repository'

interface FetchEventsByCompanySlugUseCaseRequest {
  slug: string
}

type FetchEventsByCompanySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    events: EventDetails[]
  }
>

@Injectable()
export class FetchEventsByCompanySlugUseCase {
  constructor(
    private eventsRepository: EventsRepository,
    private companiesRepository: CompaniesRepository,
  ) {}

  async execute({
    slug,
  }: FetchEventsByCompanySlugUseCaseRequest): Promise<FetchEventsByCompanySlugUseCaseResponse> {
    const company = await this.companiesRepository.findBySlug(slug)

    if (!company) {
      return failure(new ResourceNotFoundError('Company'))
    }

    const events = await this.eventsRepository.findManyByCompanyId(
      company.id.toString(),
    )

    return success({
      events,
    })
  }
}
