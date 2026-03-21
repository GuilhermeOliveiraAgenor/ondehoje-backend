import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { EventDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/event-details'

import { EventsRepository } from '../repositories/events-repository'

interface FetchEventsForUserUseCaseRequest {
  userId: string
  latitude?: number
  longitude?: number
}

type FetchEventsForUserUseCaseResponse = Either<
  null,
  {
    events: EventDetails[]
  }
>

@Injectable()
export class FetchEventsForUserUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({
    userId,
    latitude,
    longitude,
  }: FetchEventsForUserUseCaseRequest): Promise<FetchEventsForUserUseCaseResponse> {
    const events = await this.eventsRepository.findManyForUser(userId, {
      latitude,
      longitude,
    })

    return success({
      events,
    })
  }
}
