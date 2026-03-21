import {
  BadRequestException,
  Body,
  Controller,
  Post,
  PreconditionFailedException,
} from '@nestjs/common'
import z from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { CreateAddressUseCase } from '@/domain/ondehoje/application/modules/address/use-cases/create-address'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const createAddressBodySchema = z.object({
  street: z.string(),
  complement: z.string(),
  neighborhood: z.string(),
  number: z.string(),
  cep: z.string(),
  city: z.string(),
  state: z.string(),
  longitude: z.number(),
  latitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(createAddressBodySchema)

type CreateAddressBodySchema = z.infer<typeof createAddressBodySchema>

@Controller('/')
export class CreateAddressController {
  constructor(private createAddress: CreateAddressUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateAddressBodySchema,
    @CurrentUser() user: IdentityDetails,
  ) {
    const {
      street,
      complement,
      neighborhood,
      number,
      cep,
      city,
      state,
      longitude,
      latitude,
    } = body
    const userId = user.id.toString()

    const result = await this.createAddress.execute({
      street,
      complement,
      neighborhood,
      number,
      cep,
      city,
      state,
      longitude,
      latitude,
      createdBy: userId,
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
