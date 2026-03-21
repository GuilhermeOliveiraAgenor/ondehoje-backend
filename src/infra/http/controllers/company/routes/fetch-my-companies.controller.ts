import { BadRequestException, Controller, Get } from '@nestjs/common'

import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { FetchMyCompaniesUseCase } from '@/domain/ondehoje/application/modules/company/use-cases/fetch-my-companies'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'

import { CompanyPresenter } from '../presenters/company.presenter'

@Controller('/my')
export class FetchMyCompaniesController {
  constructor(private fetchMyCompanies: FetchMyCompaniesUseCase) {}

  @Get()
  async handle(@CurrentUser() user: IdentityDetails) {
    const result = await this.fetchMyCompanies.execute({
      requestedBy: user.id.toString(),
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const { companies } = result.value

    return {
      companies: companies.map(CompanyPresenter.toHTTP),
    }
  }
}
