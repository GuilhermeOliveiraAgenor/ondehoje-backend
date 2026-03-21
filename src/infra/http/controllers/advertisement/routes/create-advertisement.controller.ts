import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  PreconditionFailedException,
} from '@nestjs/common'
import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { CreateAdvertisementUseCase } from '@/domain/ondehoje/application/modules/advertisement/use-cases/create-advertisement'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const createAdvertisementBodySchema = z.object({
  companySlug: z.string(),
  eventSlug: z.string().optional(),
  description: z.string(),
  days: z.number().min(1),
})

const bodyValidationPipe = new ZodValidationPipe(createAdvertisementBodySchema)

type CreateAdvertisementBodySchema = z.infer<
  typeof createAdvertisementBodySchema
>

@Controller('/')
export class CreateAdvertisementController {
  constructor(private createAdvertisement: CreateAdvertisementUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Body(bodyValidationPipe) body: CreateAdvertisementBodySchema,
    @CurrentUser() user: IdentityDetails,
  ) {
    const { companySlug, eventSlug, description, days } = body

    const result = await this.createAdvertisement.execute({
      companySlug,
      eventSlug,
      description,
      days,
      createdBy: user.id,
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
