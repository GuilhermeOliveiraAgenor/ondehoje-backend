import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

import { IdentityDetails } from '@/domain/identity-access/enterprise/entities/value-object/identity-details'
import { FetchCompaniesForUserUseCase } from '@/domain/ondehoje/application/modules/company/use-cases/fetch-companies-for-user'
import { CurrentUser } from '@/infra/auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { CompanyDetailsPresenter } from '../presenters/company-details.presenter'

const fetchCompaniesQuerySchema = z.object({
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
})

const queryValidationPipe = new ZodValidationPipe(fetchCompaniesQuerySchema)

type FetchCompaniesQuerySchema = z.infer<typeof fetchCompaniesQuerySchema>

@Controller('/dashboard/for-user')
export class FetchCompaniesForUserController {
  constructor(private fetchCompaniesForUser: FetchCompaniesForUserUseCase) {}

  @Get()
  async handle(
    @CurrentUser() user: IdentityDetails,
    @Query(queryValidationPipe) query: FetchCompaniesQuerySchema,
  ) {
    const userId = user.id.toString()
    const { latitude, longitude } = query

    const result = await this.fetchCompaniesForUser.execute({
      userId,
      latitude,
      longitude,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const companies = result.value.companies

    return {
      companies: companies.map(CompanyDetailsPresenter.toHTTP),
    }
  }
}
