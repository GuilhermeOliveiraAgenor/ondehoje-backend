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
import { EditCompanyTypeDocumentUseCase } from '@/domain/ondehoje/application/modules/document-type/use-cases/edit-document-type'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const editDocumentTypeBodySchema = z.object({
  name: z.string(),
  description: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editDocumentTypeBodySchema)

type EditDocumentTypeBodySchema = z.infer<typeof editDocumentTypeBodySchema>

@Controller('/:id')
export class EditDocumentTypeController {
  constructor(private editDocumentType: EditCompanyTypeDocumentUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: EditDocumentTypeBodySchema,
  ) {
    const { name, description } = body

    const result = await this.editDocumentType.execute({
      name,
      description,
      documentTypeId: id,
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
