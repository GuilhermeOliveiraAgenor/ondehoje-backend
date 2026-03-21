import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { EventDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/event-details'

import { EventsRepository } from '../repositories/events-repository'

interface FetchEventsUseCaseRequest {
  latitude?: number
  longitude?: number
}

type FetchEventsUseCaseResponse = Either<
  null,
  {
    events: EventDetails[]
  }
>

@Injectable()
export class FetchEventsUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({
    latitude,
    longitude,
  }: FetchEventsUseCaseRequest): Promise<FetchEventsUseCaseResponse> {
    const events = await this.eventsRepository.findMany({
      latitude,
      longitude,
    })

    return success({
      events,
    })
  }
}
