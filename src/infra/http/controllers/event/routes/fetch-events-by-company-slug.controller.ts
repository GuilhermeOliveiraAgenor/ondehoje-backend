import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { FetchEventsByCompanySlugUseCase } from '@/domain/ondehoje/application/modules/event/use-cases/fetch-events-by-company-slug'

import { EventDetailsPresenter } from '../presenters/event-details-presenter'

@Controller('/company/:slug')
export class FetchEventsByCompanySlugController {
  constructor(private event: FetchEventsByCompanySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.event.execute({
      slug,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const { events } = result.value

    return {
      events: events.map(EventDetailsPresenter.toHTTP),
    }
  }
}
