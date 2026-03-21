import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { AdvertisementDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/advertisement-details'

import { EventsRepository } from '../../event/repositories/events-repository'
import { AdvertisementsRepository } from '../repositories/advertisements-repository'

interface FetchAdvertisementsByEventIdUseCaseRequest {
  eventId: string
}

type FetchAdvertisementsByEventIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    advertisements: AdvertisementDetails[]
  }
>

@Injectable()
export class FetchAdvertisementsByEventIdUseCase {
  constructor(
    private eventsRepository: EventsRepository,
    private advertisementsRepository: AdvertisementsRepository,
  ) {}

  async execute({
    eventId,
  }: FetchAdvertisementsByEventIdUseCaseRequest): Promise<FetchAdvertisementsByEventIdUseCaseResponse> {
    const event = await this.eventsRepository.findById(eventId)

    if (!event) {
      return failure(new ResourceNotFoundError('Event'))
    }

    const advertisements =
      await this.advertisementsRepository.findManyByEventId(eventId)

    return success({
      advertisements,
    })
  }
}
