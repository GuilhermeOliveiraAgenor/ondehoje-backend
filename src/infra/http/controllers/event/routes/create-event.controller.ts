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
import { CreateEventUseCase } from '@/domain/ondehoje/application/modules/event/use-cases/create-event'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const createEventBodySchema = z.object({
  companySlug: z.string(),
  addressId: z.string(),
  categoryId: z.string(),
  name: z.string(),
  description: z.string(),
  startDate: z.string().transform((val) => new Date(val)),
  endDate: z.string().transform((val) => new Date(val)),
  imagesIds: z.array(z.string()),
  informations: z
    .array(
      z.object({
        name: z.string(),
        description: z.string().optional(),
        phoneNumber: z.string().optional(),
        email: z.email().optional(),
      }),
    )
    .optional(),
})

const bodyValidationPipe = new ZodValidationPipe(createEventBodySchema)

type CreateEventBodySchema = z.infer<typeof createEventBodySchema>

@Controller('/')
export class CreateEventController {
  constructor(private createEvent: CreateEventUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Body(bodyValidationPipe) body: CreateEventBodySchema,
    @CurrentUser() user: IdentityDetails,
  ) {
    const {
      companySlug,
      addressId,
      categoryId,
      name,
      description,
      startDate,
      endDate,
      imagesIds,
      informations,
    } = body

    const result = await this.createEvent.execute({
      companySlug,
      addressId,
      categoryId,
      name,
      description,
      startDate,
      endDate,
      createdBy: user.id.toString(),
      imagesIds,
      informations,
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
