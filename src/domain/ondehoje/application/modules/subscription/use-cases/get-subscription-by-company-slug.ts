import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Subscription } from '@/domain/ondehoje/enterprise/entities/subscription'

import { CompaniesRepository } from '../../company/repositories/companies-repository'
import { SubscriptionsRepository } from '../repositories/subscriptions-repository'

interface GetSubscriptionByCompanySlugUseCaseRequest {
  slug: string
}

type GetSubscriptionByCompanySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    subscription: Subscription
  }
>

@Injectable()
export class GetSubscriptionByCompanySlugUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private subscriptionsRepository: SubscriptionsRepository,
  ) {}

  async execute({
    slug,
  }: GetSubscriptionByCompanySlugUseCaseRequest): Promise<GetSubscriptionByCompanySlugUseCaseResponse> {
    const company = await this.companiesRepository.findBySlug(slug)

    if (!company) {
      return failure(new ResourceNotFoundError('Company'))
    }

    const subscription = await this.subscriptionsRepository.findByCompanyId(
      company.id.toString(),
    )

    if (!subscription) {
      return failure(new ResourceNotFoundError('Subscription'))
    }

    return success({
      subscription,
    })
  }
}
