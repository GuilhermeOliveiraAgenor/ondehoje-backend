import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { GetParameterByKeyUseCase } from '@/domain/ondehoje/application/modules/parameter/use-cases/get-parameter-by-key'

import { ParameterPresenter } from '../presenters/parameter-presenter'

@Controller('/:key')
export class GetParameterByKeyController {
  constructor(private getParameterByKey: GetParameterByKeyUseCase) {}

  @Get()
  async handle(@Param('key') key: string) {
    const result = await this.getParameterByKey.execute({
      key,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const { parameter } = result.value

    if (!parameter) {
      return null
    }

    return {
      parameter: ParameterPresenter.toHTTP(parameter),
    }
  }
}
