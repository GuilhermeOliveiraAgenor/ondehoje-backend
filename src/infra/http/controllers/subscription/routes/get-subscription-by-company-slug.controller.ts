import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { GetSubscriptionByCompanySlugUseCase } from '@/domain/ondehoje/application/modules/subscription/use-cases/get-subscription-by-company-slug'

import { SubscriptionPresenter } from '../presenters/subscription-presenter'

@Controller('/company/:slug')
export class GetSubscriptionByCompanySlugController {
  constructor(
    private getSubscriptionByCompanySlug: GetSubscriptionByCompanySlugUseCase,
  ) {}

  @Get()
  async handle(@Param('slug') slug: string) {
    const result = await this.getSubscriptionByCompanySlug.execute({
      slug,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    const { subscription } = result.value

    return {
      subscription: SubscriptionPresenter.toHTTP(subscription),
    }
  }
}
