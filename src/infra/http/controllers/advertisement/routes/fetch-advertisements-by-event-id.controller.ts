import {
  BadRequestException,
  Controller,
  Get,
  Param,
  PreconditionFailedException,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { FetchAdvertisementsByEventIdUseCase } from '@/domain/ondehoje/application/modules/advertisement/use-cases/fetch-advertisements-by-event-id'

import { AdvertisementDetailsPresenter } from '../presenters/advertisement-details-presenter'

@Controller('/events/:eventId')
export class FetchAdvertisementsByEventIdController {
  constructor(
    private fetchAdvertisementsByEventId: FetchAdvertisementsByEventIdUseCase,
  ) {}

  @Get()
  async handle(@Param('eventId') eventId: string) {
    const result = await this.fetchAdvertisementsByEventId.execute({
      eventId,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new PreconditionFailedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { advertisements } = result.value

    return {
      advertisements: advertisements.map(AdvertisementDetailsPresenter.toHTTP),
    }
  }
}
