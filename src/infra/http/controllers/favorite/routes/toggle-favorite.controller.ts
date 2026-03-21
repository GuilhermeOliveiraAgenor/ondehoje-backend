import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Patch,
  PreconditionFailedException,
} from '@nestjs/common'
import z from 'zod'

import { MissingRequiredParametersError } from '@/core/errors/missing-required-parameters-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { ToggleFavoriteUseCase } from '@/domain/ondehoje/application/modules/favorite/use-cases/toggle-favorite'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const toggleFavoriteBodySchema = z.object({
  companyId: z.string().optional(),
  eventId: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(toggleFavoriteBodySchema)

type ToggleFavoriteBodySchema = z.infer<typeof toggleFavoriteBodySchema>

@Controller('/toggle')
export class ToggleFavoriteController {
  constructor(private toggleFavorite: ToggleFavoriteUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ToggleFavoriteBodySchema,
    @CurrentUser() user: IdentityDetails,
  ) {
    const { companyId, eventId } = body

    const result = await this.toggleFavorite.execute({
      userId: user.id.toString(),
      companyId,
      eventId,
    })

    if (result.isError()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new PreconditionFailedException(error.message)
        case MissingRequiredParametersError:
          throw new PreconditionFailedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
