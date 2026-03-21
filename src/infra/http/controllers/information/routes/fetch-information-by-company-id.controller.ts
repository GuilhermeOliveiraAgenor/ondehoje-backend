import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { FetchInformationByCompanyIdUseCase } from '@/domain/ondehoje/application/modules/information/use-cases/fetch-information-by-company-id'

import { InformationPresenter } from '../presenters/information-presenter'

@Controller('/company/:id')
export class FetchInformationByCompanyIdController {
  constructor(private information: FetchInformationByCompanyIdUseCase) {}

  @Get()
  async handle(@Param('id') id: string) {
    const result = await this.information.execute({
      companyId: id,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    return {
      informations: result.value.informations.map(InformationPresenter.toHTTP),
    }
  }
}
