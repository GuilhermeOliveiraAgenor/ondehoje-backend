import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { GetSubscriptionByIdUseCase } from '@/domain/ondehoje/application/modules/subscription/use-cases/get-subscription-by-id'

import { SubscriptionPresenter } from '../presenters/subscription-presenter'

@Controller('/:id')
export class GetSubscriptionByIdController {
  constructor(private subscription: GetSubscriptionByIdUseCase) {}

  @Get()
  async handle(@Param('id') subscriptionId: string) {
    const result = await this.subscription.execute({
      subscriptionId,
    })

    if (result.isError()) {
      throw new BadRequestException()
    }

    return {
      subscription: SubscriptionPresenter.toHTTP(result.value.subscription),
    }
  }
}
