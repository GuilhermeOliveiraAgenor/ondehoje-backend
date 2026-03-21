import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  PreconditionFailedException,
} from '@nestjs/common'
import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { CreateCouponUseCase } from '@/domain/ondehoje/application/modules/coupon/use-case/create-coupon'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const createCouponBodySchema = z.object({
  eventId: z.string(),
  name: z.string(),
  description: z.string(),
  expiresAt: z.coerce.date(),
})

const bodyValidationPipe = new ZodValidationPipe(createCouponBodySchema)

type CreateCouponBodySchema = z.infer<typeof createCouponBodySchema>

@Controller('/')
export class CreateCouponController {
  constructor(private createCoupon: CreateCouponUseCase) {}

  @Post()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: CreateCouponBodySchema,
    @CurrentUser() user: IdentityDetails,
  ) {
    const { eventId, name, description, expiresAt } = body

    const result = await this.createCoupon.execute({
      eventId,
      name,
      description,
      expiresAt,
      createdBy: user.id.toString(),
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
  }
}
