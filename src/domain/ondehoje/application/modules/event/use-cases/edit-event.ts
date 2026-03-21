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
import { AdvertisementStatus } from '../../advertisement/enums/advertisement-status'
import { AdvertisementsRepository } from '../../advertisement/repositories/advertisements-repository'
import { CategoriesRepository } from '../../category/repositories/categories-repository'
import { EventImagesRepository } from '../../event-image/repositories/event-images-repository'
import { InformationsRepository } from '../../information/repositories/informations-repository'
import { EventAlreadyExistsError } from '../errors/event-already-exists-error'
import { EventEndDateBeforeStartDateError } from '../errors/event-end-date-before-start-date-error'
import { EventStartDateAfterEndDateError } from '../errors/event-start-date-after-end-date-error'
import { InvalidEventDateRangeError } from '../errors/invalid-event-date-range-error'
import { EventsRepository } from '../repositories/events-repository'

interface EditEventUseCaseRequest {
  eventId: string
  addressId?: string
  categoryId?: string
  name?: Event['name']
  description?: Event['description']
  startDate?: Event['startDate']
  endDate?: Event['endDate']
  updatedBy: string
  informations?: Array<{
    id?: string
    name: string
    description?: string
    phoneNumber?: string
    email?: string
  }>
  imagesIds?: string[]
}

type EditEventUseCaseResponse = Either<
  | ResourceNotFoundError
  | EventAlreadyExistsError
  | InvalidEventDateRangeError
  | EventStartDateAfterEndDateError
  | EventEndDateBeforeStartDateError,
  {
    event: Event
  }
>

@Injectable()
export class EditEventUseCase {
  constructor(
    private eventsRepository: EventsRepository,
    private addressesRepository: AddressesRepository,
    private categoriesRepository: CategoriesRepository,
    private informationsRepository: InformationsRepository,
    private eventImagesRepository: EventImagesRepository,
    private advertisementsRepository: AdvertisementsRepository,
  ) {}

  async execute({
    eventId,
    addressId,
    categoryId,
    name,
    description,
    startDate,
    endDate,
    updatedBy,
    informations,
    imagesIds,
  }: EditEventUseCaseRequest): Promise<EditEventUseCaseResponse> {
    const event = await this.eventsRepository.findById(eventId)

    if (!event) {
      return failure(new ResourceNotFoundError('Event'))
    }

    if (event.createdBy.toString() !== updatedBy) {
      return failure(new NotAllowedError())
    }

    const eventAddressId = event.addressId.toString()
    if (addressId && addressId !== eventAddressId) {
      const address = await this.addressesRepository.findById(addressId)

      if (!address) {
        return failure(new ResourceNotFoundError('Address'))
      }

      event.addressId = address.id
    }

    const eventCategoryId = event.categoryId.toString()
    if (categoryId && categoryId !== eventCategoryId) {
      const category = await this.categoriesRepository.findById(categoryId)

      if (!category) {
        return failure(new ResourceNotFoundError('Category'))
      }

      event.categoryId = category.id
    }

    if (name && name !== event.name) {
      const slugValue = Slug.createFromText(name).value
      const currentCompanyId = event.companyId.toString()

      const eventAlreadyExists =
        await this.eventsRepository.findBySlugAndCompanyId(
          slugValue,
          currentCompanyId,
        )

      if (eventAlreadyExists) {
        return failure(new EventAlreadyExistsError(name))
      }

      event.name = name
      event.slug = Slug.createFromText(name)
    }

    if (startDate && endDate) {
      if (startDate >= endDate) {
        return failure(new InvalidEventDateRangeError())
      }

      event.startDate = startDate
      event.endDate = endDate
    } else if (startDate) {
      if (startDate >= event.endDate) {
        return failure(new EventStartDateAfterEndDateError())
      }

      event.startDate = startDate
    } else if (endDate) {
      if (event.startDate >= endDate) {
        return failure(new EventEndDateBeforeStartDateError())
      }

      event.endDate = endDate
    }

    if (informations) {
      const currentInformations =
        await this.informationsRepository.findManyByEventId(eventId)

      const informationsToDelete = currentInformations.filter((info) => {
        return !informations.some((i) => i.id === info.id.toString())
      })

      for (const information of informationsToDelete) {
        await this.informationsRepository.delete(information)
      }

      const informationsToCreate = informations.filter((info) => !info.id)

      const newInformations = informationsToCreate.map((info) => {
        return Information.create({
          name: info.name,
          description: info.description,
          phoneNumber: info.phoneNumber,
          email: info.email,
          eventId: event.id,
          createdBy: new UniqueEntityID(updatedBy),
        })
      })

      await this.informationsRepository.createMany(newInformations)

      const informationsToUpdate = informations.filter((info) => info.id)

      for (const information of informationsToUpdate) {
        const existingInformation = currentInformations.find(
          (i) => i.id.toString() === information.id,
        )

        if (existingInformation) {
          existingInformation.name = information.name
          existingInformation.description = information.description ?? null
          existingInformation.phoneNumber = information.phoneNumber ?? null
          existingInformation.email = information.email ?? null
          existingInformation.updatedBy = new UniqueEntityID(updatedBy)

          await this.informationsRepository.save(existingInformation)
        }
      }
    }

    if (imagesIds) {
      const currentEventImages =
        await this.eventImagesRepository.findManyByEventId(eventId)

      const eventImagesList = new EventImageList(currentEventImages)

      const eventImages = imagesIds.map((imageId) => {
        return EventImage.create({
          imageId: new UniqueEntityID(imageId),
          eventId: event.id,
        })
      })

      eventImagesList.update(eventImages)
      event.images = eventImagesList
    }

    event.description = description ?? event.description
    event.updatedBy = new UniqueEntityID(updatedBy)

    await this.eventsRepository.save(event)

    const hasAdvertisement =
      await this.advertisementsRepository.findFirstByEventId(eventId)

    if (hasAdvertisement) {
      hasAdvertisement.status = AdvertisementStatus.WAITING_AUTHORIZATION

      await this.advertisementsRepository.save(hasAdvertisement)
    }

    return success({
      event,
    })
  }
}
