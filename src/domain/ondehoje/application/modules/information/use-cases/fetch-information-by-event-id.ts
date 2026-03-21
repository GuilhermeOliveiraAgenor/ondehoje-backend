import { Injectable } from '@nestjs/common'

import { Either, success } from '@/core/either'
import { Information } from '@/domain/ondehoje/enterprise/entities/information'

import { InformationsRepository } from '../repositories/informations-repository'

interface FetchInformationByEventIdRequest {
  eventId: string
}
type FetchInformationByEventIdResponse = Either<
  null,
  {
    informations: Information[]
  }
>
@Injectable()
export class FetchInformationByEventIdUseCase {
  constructor(private informationsRepository: InformationsRepository) {}

  async execute({
    eventId,
  }: FetchInformationByEventIdRequest): Promise<FetchInformationByEventIdResponse> {
    const informations =
      await this.informationsRepository.findManyByEventId(eventId)

    return success({
      informations,
    })
  }
}
