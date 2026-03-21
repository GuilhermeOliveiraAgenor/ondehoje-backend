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
import { EditAddressUseCase } from '@/domain/ondehoje/application/modules/address/use-cases/edit-address'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

const editAddressBodySchema = z.object({
  street: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  number: z.string().optional(),
  cep: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  longitude: z.number().optional(),
  latitude: z.number().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editAddressBodySchema)

type EditAddressBodySchema = z.infer<typeof editAddressBodySchema>

@Controller('/:id')
export class EditAddressController {
  constructor(private editAddress: EditAddressUseCase) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(
    @Param('id') id: string,
    @Body(bodyValidationPipe) body: EditAddressBodySchema,
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

    const result = await this.editAddress.execute({
      clientId: user.id.toString(),
      addressId: id,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      cep,
      longitude,
      latitude,
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
