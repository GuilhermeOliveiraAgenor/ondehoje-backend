import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { FetchEventsForUserUseCase } from '@/domain/ondehoje/application/modules/event/use-cases/fetch-events-for-user'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { EventLocationDetailsPresenter } from '../presenters/event-location-details-presenter'

const fetchEventsQuerySchema = z.object({
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
})

const queryValidationPipe = new ZodValidationPipe(fetchEventsQuerySchema)

type FetchEventsQuerySchema = z.infer<typeof fetchEventsQuerySchema>

@Controller('/dashboard/for-user')
export class FetchEventsForUserController {
  constructor(private fetchEventsForUser: FetchEventsForUserUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: IdentityDetails,
    @Query(queryValidationPipe) query: FetchEventsQuerySchema,
  ) {
    const userId = user.id.toString()
    const { latitude, longitude } = query

    const result = await this.fetchEventsForUser.execute({
      userId,
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
