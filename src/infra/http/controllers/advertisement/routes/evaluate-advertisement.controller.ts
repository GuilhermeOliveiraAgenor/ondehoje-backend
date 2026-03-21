import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  MethodNotAllowedException,
  Param,
  Patch,
  PreconditionFailedException,
} from '@nestjs/common'
import z from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { EvaluateAdvertisementUseCase } from '@/domain/ondehoje/application/modules/advertisement/use-cases/evaluate-advertisement'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const evaluateAdvertisementBodySchema = z.object({
  approved: z.boolean(),
  rejectedReason: z.string().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(
  evaluateAdvertisementBodySchema,
)

type EvaluateAdvertisementBodySchema = z.infer<
  typeof evaluateAdvertisementBodySchema
>

@Controller('/evaluate/:advertisementId')
export class EvaluateAdvertisementController {
  constructor(private evaluateAdvertisement: EvaluateAdvertisementUseCase) {}

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @CurrentUser() user: IdentityDetails,
    @Body(bodyValidationPipe) body: EvaluateAdvertisementBodySchema,
    @Param('advertisementId') advertisementId: string,
  ) {
    const { approved, rejectedReason } = body

    const result = await this.evaluateAdvertisement.execute({
      actor: user,
      advertisementId,
      approved,
      rejectedReason,
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
  }
}
