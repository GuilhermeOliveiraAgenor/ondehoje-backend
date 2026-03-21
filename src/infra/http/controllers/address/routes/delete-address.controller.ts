import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  PreconditionFailedException,
} from '@nestjs/common'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { DeleteAddressUseCase } from '@/domain/ondehoje/application/modules/address/use-cases/delete-address'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'

@Controller('/:id')
export class DeleteAddressController {
  constructor(private deleteAddress: DeleteAddressUseCase) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async handle(@Param('id') id: string, @CurrentUser() user: IdentityDetails) {
    const result = await this.deleteAddress.execute({
      clientId: user.id,
      addressId: new UniqueEntityID(id),
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
