import {
  BadRequestException,
  Controller,
  Get,
  Param,
  PreconditionFailedException,
} from '@nestjs/common'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { FetchAdvertisementsByCompanyIdUseCase } from '@/domain/ondehoje/application/modules/advertisement/use-cases/fetch-advertisements-by-company-id'

import { AdvertisementDetailsPresenter } from '../presenters/advertisement-details-presenter'

@Controller('/companies/:companyId')
export class FetchAdvertisementsByCompanyIdController {
  constructor(
    private fetchAdvertisementsByCompanyId: FetchAdvertisementsByCompanyIdUseCase,
  ) {}

  @Get()
  async handle(@Param('companyId') companyId: string) {
    const result = await this.fetchAdvertisementsByCompanyId.execute({
      companyId,
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
