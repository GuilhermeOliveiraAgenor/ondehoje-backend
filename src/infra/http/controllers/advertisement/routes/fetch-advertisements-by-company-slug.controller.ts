import {
  BadRequestException,
  Controller,
  Get,
  MethodNotAllowedException,
  Param,
  PreconditionFailedException,
} from '@nestjs/common'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { FetchAdvertisementsByCompanySlugUseCase } from '@/domain/ondehoje/application/modules/advertisement/use-cases/fetch-advertisements-by-company-slug'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'

import { AdvertisementDetailsPresenter } from '../presenters/advertisement-details-presenter'

@Controller('/:slug')
export class FetchAdvertisementsByCompanySlugController {
  constructor(
    private fetchAdvertisementsByCompanySlug: FetchAdvertisementsByCompanySlugUseCase,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: IdentityDetails,
    @Param('slug') slug: string,
  ) {
    const result = await this.fetchAdvertisementsByCompanySlug.execute({
      slug,
      requestedBy: user.id.toString(),
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new PreconditionFailedException(error.message)
        case NotAllowedError:
          throw new MethodNotAllowedException(error.message)
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
