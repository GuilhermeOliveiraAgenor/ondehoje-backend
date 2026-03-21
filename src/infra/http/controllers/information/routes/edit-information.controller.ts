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
import { EditInformationUseCase } from '@/domain/ondehoje/application/modules/information/use-cases/edit-information'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const editInformationBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  phoneNumber: z.string(),
  email: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editInformationBodySchema)

type EditInformationBodySchema = z.infer<typeof editInformationBodySchema>

@Controller('/:id')
export class EditInformationController {
  constructor(private editInformation: EditInformationUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: EditInformationBodySchema,
    @CurrentUser() user: IdentityDetails,
  ) {
    const { name, description, phoneNumber, email } = body

    const result = await this.editInformation.execute({
      name,
      description,
      phoneNumber,
      email,
      updatedBy: user.id.toString(),
      informationId: id,
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
