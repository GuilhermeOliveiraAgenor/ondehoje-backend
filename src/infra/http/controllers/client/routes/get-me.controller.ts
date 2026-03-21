import { BadRequestException, Controller, Get } from '@nestjs/common'

import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { GetMeUseCase } from '@/domain/ondehoje/application/modules/client/use-cases/get-me'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { IdentityPresenter } from '@/infra/http/presenters/identity-presenter'

@Controller('/me')
export class GetMeController {
  constructor(private getMe: GetMeUseCase) {}

  @Get()
  async handle(@CurrentUser() user: IdentityDetails) {
    const result = await this.getMe.execute({
      requestedBy: user.id,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const client = IdentityPresenter.toHTTP(result.value.client)

    return {
      client,
    }
  }
}
