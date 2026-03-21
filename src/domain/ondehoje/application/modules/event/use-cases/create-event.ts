import { Injectable } from '@nestjs/common'

import { Either, failure, success } from '@/core/either'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Event } from '@/domain/ondehoje/enterprise/entities/event'
import { EventImage } from '@/domain/ondehoje/enterprise/entities/event-image'
import { EventImageList } from '@/domain/ondehoje/enterprise/entities/event-image-list'
import { Information } from '@/domain/ondehoje/enterprise/entities/information'
import { Slug } from '@/domain/ondehoje/enterprise/entities/value-objects/slug'

import { AddressesRepository } from '../../address/repositories/addresses-repository'
import { CategoriesRepository } from '../../category/repositories/categories-repository'
import { CompaniesRepository } from '../../company/repositories/companies-repository'
import { InformationsRepository } from '../../information/repositories/informations-repository'
import { SubscriptionStatus } from '../../subscription/enum/subscription-status'
import { InactiveSubscriptionError } from '../../subscription/errors/inactive-subscription-error'
import { SubscriptionsRepository } from '../../subscription/repositories/subscriptions-repository'
import { EventAlreadyExistsError } from '../errors/event-already-exists-error'
import { InvalidEventDateRangeError } from '../errors/invalid-event-date-range-error'
import { EventsRepository } from '../repositories/events-repository'

interface CreateEventUseCaseRequest {
  companySlug: string
  addressId: string
  categoryId: string
  name: Event['name']
  description?: Event['description']
  startDate: Event['startDate']
  endDate: Event['endDate']
  createdBy: string
  imagesIds: string[]
  informations?: Array<{
    name: string
    description?: string
    phoneNumber?: string
    email?: string
  }>
}

type CreateEventUseCaseResponse = Either<
  | ResourceNotFoundError
  | InactiveSubscriptionError
  | EventAlreadyExistsError
  | InvalidEventDateRangeError,
  {
    event: Event
  }
>

@Injectable()
export class CreateEventUseCase {
  constructor(
    private companiesRepository: CompaniesRepository,
    private subscriptionsRepository: SubscriptionsRepository,
    private addressesRepository: AddressesRepository,
    private categoriesRepository: CategoriesRepository,
    private eventsRepository: EventsRepository,
    private informationsRepository: InformationsRepository,
  ) {}

  async execute({
    companySlug,
    addressId,
    categoryId,
    name,
    description,
    startDate,
    endDate,
    createdBy,
    imagesIds,
    informations,
  }: CreateEventUseCaseRequest): Promise<CreateEventUseCaseResponse> {
    const company = await this.companiesRepository.findBySlug(companySlug)

    if (!company) {
      return failure(new ResourceNotFoundError('Company'))
    }

    const subscription = await this.subscriptionsRepository.findByCompanyId(
      company.id.toString(),
    )

    if (!subscription) {
      return failure(new ResourceNotFoundError('Company subscription'))
    }

    if (
      subscription.status !== SubscriptionStatus.ACTIVE &&
      subscription.status !== SubscriptionStatus.TRIAL
    ) {
      return failure(new InactiveSubscriptionError())
    }

    const address = await this.addressesRepository.findById(addressId)

    if (!address) {
      return failure(new ResourceNotFoundError('Address'))
    }

    if (address.createdBy.toString() !== createdBy) {
      return failure(new NotAllowedError())
    }

    const category = await this.categoriesRepository.findById(categoryId)

    if (!category) {
      return failure(new ResourceNotFoundError('Category'))
    }

    const eventSlug = Slug.createFromText(name).value
    const eventWithSameSlug =
      await this.eventsRepository.findBySlugAndCompanyId(
        eventSlug,
        company.id.toString(),
      )

    if (eventWithSameSlug) {
      return failure(new EventAlreadyExistsError(name))
    }

    if (startDate >= endDate) {
      return failure(new InvalidEventDateRangeError())
    }

    const event = Event.create({
      companyId: company.id,
      addressId: address.id,
      categoryId: category.id,
      name,
      description,
      startDate,
      endDate,
      createdBy: new UniqueEntityID(createdBy),
    })

    const eventImages = imagesIds.map((imageId) => {
      return EventImage.create({
        imageId: new UniqueEntityID(imageId),
        eventId: event.id,
      })
    })

    event.images = new EventImageList(eventImages)

    await this.eventsRepository.create(event)

    if (informations) {
      const informationsToCreate = informations.map((info) => {
        return Information.create({
          eventId: event.id,
          name: info.name,
          description: info.description ?? '',
          phoneNumber: info.phoneNumber ?? '',
          email: info.email ?? '',
          createdBy: new UniqueEntityID(createdBy),
        })
      })

      await this.informationsRepository.createMany(informationsToCreate)
    }

    return success({
      event,
    })
  }
}
