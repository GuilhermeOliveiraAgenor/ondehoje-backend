import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  PreconditionFailedException,
  Put,
} from '@nestjs/common'
import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EditCouponUseCase } from '@/domain/ondehoje/application/modules/coupon/use-case/edit-coupon'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const editCouponBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  expiresAt: z.coerce.date(),
})

const bodyValidationPipe = new ZodValidationPipe(editCouponBodySchema)

type EditCouponBodySchema = z.infer<typeof editCouponBodySchema>

@Controller('/:id')
export class EditCouponController {
  constructor(private editCoupon: EditCouponUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: EditCouponBodySchema,
  ) {
    const { name, description, expiresAt } = body

    const result = await this.editCoupon.execute({
      id,
      name,
      description,
      expiresAt,
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
