import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

import { FetchCompaniesUseCase } from '@/domain/ondehoje/application/modules/company/use-cases/fetch-companies'
import { Public } from '@/infra/auth/decorators/public'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'

import { CompanyDetailsPresenter } from '../presenters/company-details.presenter'

const fetchCompaniesQuerySchema = z.object({
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
})

const queryValidationPipe = new ZodValidationPipe(fetchCompaniesQuerySchema)

type FetchCompaniesQuerySchema = z.infer<typeof fetchCompaniesQuerySchema>

@Controller('/')
@Public()
export class FetchCompaniesController {
  constructor(private fetchCompanies: FetchCompaniesUseCase) {}

  @Get()
  async handle(@Query(queryValidationPipe) query: FetchCompaniesQuerySchema) {
    const { latitude, longitude } = query

    const result = await this.fetchCompanies.execute({
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
