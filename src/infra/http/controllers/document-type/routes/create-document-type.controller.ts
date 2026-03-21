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
import { RegisterDocumentTypeUseCase } from '@/domain/ondehoje/application/modules/document-type/use-cases/create-document-type'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'

import { ZodValidationPipe } from '../../../pipes/zod-validation-pipe'

const createDocumentTypeBodySchema = z.object({
  name: z.string(),
  description: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  createDocumentTypeBodySchema,
)

type CreateDocumentTypeBodySchema = z.infer<
  typeof createDocumentTypeBodySchema
>

@Controller('/')
export class CreateDocumentTypeController {
  constructor(
    private createDocumentType: RegisterDocumentTypeUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: CreateDocumentTypeBodySchema,
    @CurrentUser() user: IdentityDetails,
  ) {
    const { name, description } = body

    const result = await this.createDocumentType.execute({
      name,
      description,
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
