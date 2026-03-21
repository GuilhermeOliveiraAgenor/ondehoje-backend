import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  MethodNotAllowedException,
  Param,
  PreconditionFailedException,
  Put,
} from '@nestjs/common'
import z from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { EditCompanyUseCase } from '@/domain/ondehoje/application/modules/company/use-cases/edit-company'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const editCompanyBodySchema = z.object({
  addressId: z.string().optional(),
  name: z.string().optional(),
  socialName: z.string().optional(),
  document: z.string().optional(),
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
  documentsIds: z.array(z.string()).optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editCompanyBodySchema)

type EditCompanyBodySchema = z.infer<typeof editCompanyBodySchema>

@Controller('/:id')
export class EditCompanyController {
  constructor(private editCompany: EditCompanyUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @CurrentUser() user: IdentityDetails,
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: EditCompanyBodySchema,
  ) {
    const userId = user.id.toString()
    const {
      addressId,
      name,
      socialName,
      document,
      informations,
      imagesIds,
      documentsIds,
    } = body

    const result = await this.editCompany.execute({
      id,
      addressId,
      name,
      socialName,
      document,
      informations,
      imagesIds,
      documentsIds,
      updatedBy: userId,
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
