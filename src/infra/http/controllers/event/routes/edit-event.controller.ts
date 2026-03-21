import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  PreconditionFailedException,
  Put,
} from '@nestjs/common'
import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { EditEventUseCase } from '@/domain/ondehoje/application/modules/event/use-cases/edit-event'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const editEventBodySchema = z.object({
  addressId: z.string().optional(),
  categoryId: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  startDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  endDate: z
    .string()
    .transform((val) => new Date(val))
    .optional(),
  informations: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string(),
        description: z.coerce.string().optional(),
        phoneNumber: z.coerce.string().optional(),
        email: z.coerce.string().optional(),
      }),
    )
    .optional(),
  imagesIds: z.array(z.string()).optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editEventBodySchema)

type EditEventBodySchema = z.infer<typeof editEventBodySchema>

@Controller('/:eventId')
export class EditEventController {
  constructor(private editEvent: EditEventUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param('eventId') eventId: string,
    @Body(bodyValidationPipe) body: EditEventBodySchema,
    @CurrentUser() user: IdentityDetails,
  ) {
    const {
      name,
      description,
      addressId,
      categoryId,
      startDate,
      endDate,
      informations,
      imagesIds,
    } = body

    const result = await this.editEvent.execute({
      eventId,
      addressId,
      categoryId,
      name,
      description,
      startDate,
      endDate,
      informations,
      imagesIds,
      updatedBy: user.id.toString(),
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
