import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { EventsRepository } from '../repositories/events-repository'

interface DeleteEventUseCaseRequest {
  eventId: string
  deletedBy: string
}

type DeleteEventUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

@Injectable()
export class DeleteEventUseCase {
  constructor(private eventsRepository: EventsRepository) {}

  async execute({
    eventId,
    deletedBy,
  }: DeleteEventUseCaseRequest): Promise<DeleteEventUseCaseResponse> {
    const event = await this.eventsRepository.findById(eventId)

    if (!event) {
      return failure(new ResourceNotFoundError('Event'))
    }

    if (event.createdBy.toString() !== deletedBy) {
      return failure(new NotAllowedError())
    }

    event.deletedAt = new Date()
    event.deletedBy = new UniqueEntityID(deletedBy)

    await this.eventsRepository.save(event)

    return success(null)
  }
}
