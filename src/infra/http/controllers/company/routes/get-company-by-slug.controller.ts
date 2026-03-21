import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { GetCompanyBySlugUseCase } from '@/domain/ondehoje/application/modules/company/use-cases/get-company-by-slug'
import { Public } from '@/infra/auth/decorators/public'

import { CompanyDetailsPresenter } from '../presenters/company-details.presenter'

@Controller('/:slug')
@Public()
export class GetCompanyBySlugController {
  constructor(private getCompanyBySlug: GetCompanyBySlugUseCase) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getCompanyBySlug.execute({ slug })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const company = result.value.company

    return {
      company: CompanyDetailsPresenter.toHTTP(company),
    }
  }
}
