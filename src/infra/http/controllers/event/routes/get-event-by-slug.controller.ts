import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { GetEventBySlugUseCase } from '@/domain/ondehoje/application/modules/event/use-cases/get-event-by-slug'
import { Public } from '@/infra/auth/decorators/public'

import { EventDetailsPresenter } from '../presenters/event-details-presenter'

@Controller('/:slug')
@Public()
export class GetEventBySlugController {
  constructor(private getEventBySlug: GetEventBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getEventBySlug.execute({ slug })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const event = result.value.event

    return {
      event: EventDetailsPresenter.toHTTP(event),
    }
  }
}
