import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EventDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/event-details'

import { EventsRepository } from '../repositories/events-repository'

interface GetEventBySlugUseCaseRequest {
  slug: string
}

type GetEventBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    event: EventDetails
  }
>

@Injectable()
export class GetEventBySlugUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({
    slug,
  }: GetEventBySlugUseCaseRequest): Promise<GetEventBySlugUseCaseResponse> {
    const event = await this.eventsRepository.findDetails(slug)

    if (!event) {
      return failure(new ResourceNotFoundError('Event'))
    }

    return success({
      event,
    })
  }
}
