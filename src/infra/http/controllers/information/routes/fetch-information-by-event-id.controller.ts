import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { FetchInformationByEventIdUseCase } from '@/domain/ondehoje/application/modules/information/use-cases/fetch-information-by-event-id'

import { InformationPresenter } from '../presenters/information-presenter'

@Controller('/event/:id')
export class FetchInformationByEventIdController {
  constructor(private information: FetchInformationByEventIdUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.information.execute({
      eventId: id,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const informationsHTTP = result.value.informations.map(
      InformationPresenter.toHTTP,
    )

    return {
      informations: informationsHTTP,
    }
  }
}
