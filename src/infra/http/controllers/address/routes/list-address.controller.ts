import { BadRequestException, Controller, Get } from '@nestjs/common'

import type { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { ListAddressesUseCase } from '@/domain/ondehoje/application/modules/address/use-cases/list-address'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'

import { AddressPresenter } from '../presenters/address-presenter'

@Controller('/')
export class ListAddressesController {
  constructor(private listAddress: ListAddressesUseCase) {}

  @Get()
  async handle(@CurrentUser() user: IdentityDetails) {
    const result = await this.listAddress.execute({
      userId: user.id.toString(),
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const address = result.value.addresses

    return {
      address: address.map(AddressPresenter.toHTTP),
    }
  }
}
