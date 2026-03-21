import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

import { FetchEventsUseCase } from '@/domain/ondehoje/application/modules/event/use-cases/fetch-events'
import { Public } from '@/infra/auth/decorators/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { EventLocationDetailsPresenter } from '../presenters/event-location-details-presenter'

const fetchEventsQuerySchema = z.object({
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
})

const queryValidationPipe = new ZodValidationPipe(fetchEventsQuerySchema)

type FetchEventsQuerySchema = z.infer<typeof fetchEventsQuerySchema>

@Controller('/')
@Public()
export class FetchEventsController {
  constructor(private fetchEvents: FetchEventsUseCase) {}

  @Get()
  async handle(@Query(queryValidationPipe) query: FetchEventsQuerySchema) {
    const { latitude, longitude } = query

    const result = await this.fetchEvents.execute({
      latitude,
      longitude,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const events = result.value.events

    return {
      events: events.map(EventLocationDetailsPresenter.toHTTP),
    }
  }
}
