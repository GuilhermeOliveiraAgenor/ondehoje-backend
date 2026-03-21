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
import { CreateCategoryUseCase } from '@/domain/ondehoje/application/modules/category/use-cases/create-category'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const createCategoryBodySchema = z.object({
  name: z.string(),
  description: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createCategoryBodySchema)

type CreateCategoryBodySchema = z.infer<typeof createCategoryBodySchema>

@Controller('/')
export class CreateCategoryController {
  constructor(private createCategory: CreateCategoryUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async handle(
    @Body(bodyValidationPipe) body: CreateCategoryBodySchema,
    @CurrentUser() user: IdentityDetails,
  ) {
    const { name, description } = body
    const result = await this.createCategory.execute({
      name,
      description,
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
