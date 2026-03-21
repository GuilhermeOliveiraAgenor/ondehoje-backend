import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Subscription } from '@/domain/ondehoje/enterprise/entities/subscription'

import { SubscriptionsRepository } from '../repositories/subscriptions-repository'

interface GetSubscriptionByIdUseCaseRequest {
  subscriptionId: string
}

type GetSubscriptionByIdUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    subscription: Subscription
  }
>

@Injectable()
export class GetSubscriptionByIdUseCase {
  constructor(private subscriptionsRepository: SubscriptionsRepository) {}

  async execute({
    subscriptionId,
  }: GetSubscriptionByIdUseCaseRequest): Promise<GetSubscriptionByIdUseCaseResponse> {
    const subscription =
      await this.subscriptionsRepository.findById(subscriptionId)

    if (!subscription) {
      return failure(new ResourceNotFoundError('Subscription'))
    }

    return success({
      subscription,
    })
  }
}
