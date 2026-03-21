import {
  BadRequestException,
  Body,
  Controller,
  MethodNotAllowedException,
  Post,
  PreconditionFailedException,
} from '@nestjs/common'
import z from 'zod'

import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { CreateCompanyUseCase } from '@/domain/ondehoje/application/modules/company/use-cases/create-company'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const createCompanyBodySchema = z.object({
  addressId: z.string(),
  name: z.string(),
  socialName: z.string(),
  document: z.string(),
  documentsIds: z.array(z.string()),
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

const bodyValidationPipe = new ZodValidationPipe(createCompanyBodySchema)

type CreateCompanyBodySchema = z.infer<typeof createCompanyBodySchema>

@Controller('/')
export class CreateCompanyController {
  constructor(private createCompany: CreateCompanyUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateCompanyBodySchema,
    @CurrentUser() user: IdentityDetails,
  ) {
    const {
      addressId,
      name,
      socialName,
      document,
      documentsIds,
      imagesIds,
      informations,
    } = body

    const result = await this.createCompany.execute({
      addressId,
      name,
      socialName,
      document,
      documentsIds,
      imagesIds,
      informations,
      createdBy: user.id,
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
