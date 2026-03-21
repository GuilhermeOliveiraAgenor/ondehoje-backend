import { Injectable } from '@nestjs/common'

import { type Either, failure, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Advertisement } from '@/domain/ondehoje/enterprise/entities/advertisement'
import { Event } from '@/domain/ondehoje/enterprise/entities/event'

import { CompaniesRepository } from '../../company/repositories/companies-repository'
import { EventsRepository } from '../../event/repositories/events-repository'
import { ParametersRepository } from '../../parameter/repositories/parameters-repository'
import { InactiveSubscriptionError } from '../../subscription/errors/inactive-subscription-error'
import { SubscriptionsRepository } from '../../subscription/repositories/subscriptions-repository'
import { AdvertisementsRepository } from '../repositories/advertisements-repository'

interface CreateAdvertisementUseCaseRequest {
  companySlug: string
  eventSlug?: string
  description: Advertisement['description']
  days: Advertisement['days']
  createdBy: Advertisement['createdBy']
}

type CreateAdvertisementUseCaseResponse = Either<ResourceNotFoundError, null>

@Injectable()
export class CreateAdvertisementUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private eventsRepository: EventsRepository,
    private susbcriptionsRepository: SubscriptionsRepository,
    private parametersRepository: ParametersRepository,
    private advertisementsRepository: AdvertisementsRepository,
  ) {}

  async execute({
    companySlug,
    eventSlug,
    description,
    days,
    createdBy,
  }: CreateAdvertisementUseCaseRequest): Promise<CreateAdvertisementUseCaseResponse> {
    const company = await this.companiesRepository.findBySlug(companySlug)

    if (!company) {
      return failure(new ResourceNotFoundError('Company'))
    }

    let event: Event | null = null

    if (eventSlug) {
      event = await this.eventsRepository.findBySlugAndCompanyId(
        eventSlug,
        company.id.toString(),
      )

      if (!event) {
        return failure(new ResourceNotFoundError('Event'))
      }
    }

    const subscription = await this.susbcriptionsRepository.findByCompanyId(
      company.id.toString(),
    )

    if (!subscription) {
      return failure(new ResourceNotFoundError('Subscription'))
    }

    const currentDate = new Date()
    if (subscription.endDate < currentDate) {
      return failure(new InactiveSubscriptionError())
    }

    const expirationDate = new Date(
      new Date().setDate(new Date().getDate() + days),
    )

    const baseDailyPricePromise = this.parametersRepository.findByKey(
      'advertisement.base.daily.price',
    )

    const discountThresholdDaysPromise = this.parametersRepository.findByKey(
      'advertisement.discount.threshold.days',
    )

    const discountPercentagePromise = this.parametersRepository.findByKey(
      'advertisement.discount.percentage',
    )

    const [baseDailyPrice, discountThresholdDays, discountPercentage] =
      await Promise.all([
        baseDailyPricePromise,
        discountThresholdDaysPromise,
        discountPercentagePromise,
      ])

    if (!baseDailyPrice || !discountThresholdDays || !discountPercentage) {
      return failure(new ResourceNotFoundError('Advertisement Parameters'))
    }

    let calculatedAmount = Number(baseDailyPrice.value) * days

    if (days >= Number(discountThresholdDays.value)) {
      const discount =
        (calculatedAmount * Number(discountPercentage.value)) / 100
      calculatedAmount -= discount
    }

    const advertisement = Advertisement.create({
      companyId: company.id,
      eventId: event ? event.id : null,
      description,
      days,
      amount: calculatedAmount * 100, // Store amount in cents
      expirationDate,
      createdBy,
    })

    await this.advertisementsRepository.create(advertisement)

    return success(null)
  }
}
