import { EventsRepository } from '@/domain/ondehoje/application/modules/event/repositories/events-repository'
import { Event } from '@/domain/ondehoje/enterprise/entities/event'
import { Image } from '@/domain/ondehoje/enterprise/entities/image'
import { EventDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/event-details'

import { InMemoryAddressesRepository } from './in-memory-addresses-repository'
import { InMemoryCategoriesRepository } from './in-memory-categories-repository'
import { InMemoryCompaniesRepository } from './in-memory-companies-repository'
import { InMemoryEventImagesRepository } from './in-memory-event-images-repository'
import { InMemoryImagesRepository } from './in-memory-images-repository'
import { InMemoryInformationsRepository } from './in-memory-informations-repository'

export class InMemoryEventsRepository implements EventsRepository {
  public items: Event[] = []

  constructor(
    private companiesRepository: InMemoryCompaniesRepository,
    private addressesRepository: InMemoryAddressesRepository,
    private categoriesRepository: InMemoryCategoriesRepository,
    private informationsRepository: InMemoryInformationsRepository,
    private imagesRepository: InMemoryImagesRepository,
    private eventImagesRepository: InMemoryEventImagesRepository,
  ) {}

  async findById(id: string): Promise<Event | null> {
    const event = this.items.find((item) => item.id.toString() === id)

    if (!event) {
      return null
    }

    return event
  }

  async findBySlugAndCompanyId(
    slug: string,
    companyId: string,
  ): Promise<Event | null> {
    const event = this.items.find(
      (item) =>
        item.slug.value === slug && item.companyId.toString() === companyId,
    )

    if (!event) {
      return null
    }

    return event
  }

  async findDetails(slug: string): Promise<EventDetails | null> {
    const event = this.items.find((item) => item.slug.value === slug)

    if (!event) {
      return null
    }

    const company = this.companiesRepository.items.find(
      (company) => company.id.toString() === event.companyId.toString(),
    )

    const address = this.addressesRepository.items.find(
      (address) => address.id.toString() === event.addressId.toString(),
    )

    const category = this.categoriesRepository.items.find(
      (category) => category.id.toString() === event.categoryId.toString(),
    )

    const informations = this.informationsRepository.items.filter(
      (information) => information.eventId?.toString() === event.id.toString(),
    )

    if (!company || !address || !category) {
      return null
    }

    const companyDetails = await this.companiesRepository.findBySlug(
      company.slug.value,
    )

    if (!companyDetails) {
      return null
    }

    const userImage = this.eventImagesRepository.items.filter(
      (eventImage) => eventImage.eventId === event.id,
    )

    const images = this.imagesRepository.items
      .filter((image) =>
        userImage.some(
          (eventImage) => eventImage.imageId.toString() === image.id.toString(),
        ),
      )
      .map((image) => {
        return Image.create(
          {
            url: image.url,
            alt: image.alt,
            createdAt: image.createdAt,
          },
          image.id,
        )
      })

    const eventDetails = EventDetails.create({
      id: event.id,
      name: event.name,
      slug: event.slug,
      description: event.description,
      startDate: event.startDate,
      endDate: event.endDate,
      createdAt: event.createdAt,
      createdBy: event.createdBy,
      updatedAt: event.updatedAt,
      updatedBy: event.updatedBy,
      deletedAt: event.deletedAt,
      deletedBy: event.deletedBy,
      company: companyDetails,
      address,
      category,
      informations,
      images,
      isFavorited: false,
    })

    return eventDetails
  }

  async findManyByCompanyId(companyId: string): Promise<EventDetails[]> {
    const eventsPromise = this.items
      .filter(
        (item) =>
          item.companyId.toString() === companyId &&
          item.deletedAt === null &&
          item.deletedBy === null,
      )
      .map(async (event) => {
        const company = this.companiesRepository.items.find(
          (company) => company.id.toString() === event.companyId.toString(),
        )

        const address = this.addressesRepository.items.find(
          (address) => address.id.toString() === event.addressId.toString(),
        )

        const category = this.categoriesRepository.items.find(
          (category) => category.id.toString() === event.categoryId.toString(),
        )

        const informations = this.informationsRepository.items.filter(
          (information) =>
            information.eventId?.toString() === event.id.toString(),
        )

        if (!company || !address || !category) {
          return null
        }

        const companyDetails = await this.companiesRepository.findBySlug(
          company.slug.value,
        )

        if (!companyDetails) {
          return null
        }

        const userImage = this.eventImagesRepository.items.filter(
          (eventImage) => eventImage.eventId === event.id,
        )

        const images = this.imagesRepository.items
          .filter((image) =>
            userImage.some(
              (eventImage) =>
                eventImage.imageId.toString() === image.id.toString(),
            ),
          )
          .map((image) => {
            return Image.create(
              {
                url: image.url,
                alt: image.alt,
                createdAt: image.createdAt,
              },
              image.id,
            )
          })

        return EventDetails.create({
          id: event.id,
          name: event.name,
          slug: event.slug,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          createdAt: event.createdAt,
          createdBy: event.createdBy,
          updatedAt: event.updatedAt,
          updatedBy: event.updatedBy,
          deletedAt: event.deletedAt,
          deletedBy: event.deletedBy,
          company: companyDetails,
          address,
          category,
          informations,
          images,
          isFavorited: false,
        })
      })

    const events = (await Promise.all(eventsPromise)).filter(
      (event): event is EventDetails => event !== null,
    )

    return events
  }

  async findMany(): Promise<EventDetails[]> {
    const eventsPromise = this.items
      .filter((item) => item.deletedAt === null && item.deletedBy === null)
      .map(async (event) => {
        const company = this.companiesRepository.items.find(
          (company) => company.id.toString() === event.companyId.toString(),
        )

        const address = this.addressesRepository.items.find(
          (address) => address.id.toString() === event.addressId.toString(),
        )

        const category = this.categoriesRepository.items.find(
          (category) => category.id.toString() === event.categoryId.toString(),
        )

        const informations = this.informationsRepository.items.filter(
          (information) =>
            information.eventId?.toString() === event.id.toString(),
        )

        if (!company || !address || !category) {
          return null
        }

        const companyDetails = await this.companiesRepository.findBySlug(
          company.slug.value,
        )

        if (!companyDetails) {
          return null
        }

        const userImage = this.eventImagesRepository.items.filter(
          (eventImage) => eventImage.eventId === event.id,
        )

        const images = this.imagesRepository.items
          .filter((image) =>
            userImage.some(
              (eventImage) =>
                eventImage.imageId.toString() === image.id.toString(),
            ),
          )
          .map((image) => {
            return Image.create(
              {
                url: image.url,
                alt: image.alt,
                createdAt: image.createdAt,
              },
              image.id,
            )
          })

        return EventDetails.create({
          id: event.id,
          name: event.name,
          slug: event.slug,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          createdAt: event.createdAt,
          createdBy: event.createdBy,
          updatedAt: event.updatedAt,
          updatedBy: event.updatedBy,
          deletedAt: event.deletedAt,
          deletedBy: event.deletedBy,
          company: companyDetails,
          address,
          category,
          informations,
          images,
          isFavorited: false,
        })
      })

    const events = (await Promise.all(eventsPromise)).filter(
      (event): event is EventDetails => event !== null,
    )

    return events.length > 0 ? events : []
  }

  async findManyForUser(): Promise<EventDetails[]> {
    const eventsPromise = this.items
      .filter((item) => item.deletedAt === null && item.deletedBy === null)
      .map(async (event) => {
        const company = this.companiesRepository.items.find(
          (company) => company.id.toString() === event.companyId.toString(),
        )

        const address = this.addressesRepository.items.find(
          (address) => address.id.toString() === event.addressId.toString(),
        )

        const category = this.categoriesRepository.items.find(
          (category) => category.id.toString() === event.categoryId.toString(),
        )

        const informations = this.informationsRepository.items.filter(
          (information) =>
            information.eventId?.toString() === event.id.toString(),
        )

        if (!company || !address || !category) {
          return null
        }

        const companyDetails = await this.companiesRepository.findBySlug(
          company.slug.value,
        )

        if (!companyDetails) {
          return null
        }

        const userImage = this.eventImagesRepository.items.filter(
          (eventImage) => eventImage.eventId === event.id,
        )

        const images = this.imagesRepository.items
          .filter((image) =>
            userImage.some(
              (eventImage) =>
                eventImage.imageId.toString() === image.id.toString(),
            ),
          )
          .map((image) => {
            return Image.create(
              {
                url: image.url,
                alt: image.alt,
                createdAt: image.createdAt,
              },
              image.id,
            )
          })

        return EventDetails.create({
          id: event.id,
          name: event.name,
          slug: event.slug,
          description: event.description,
          startDate: event.startDate,
          endDate: event.endDate,
          createdAt: event.createdAt,
          createdBy: event.createdBy,
          updatedAt: event.updatedAt,
          updatedBy: event.updatedBy,
          deletedAt: event.deletedAt,
          deletedBy: event.deletedBy,
          company: companyDetails,
          address,
          category,
          informations,
          images,
          isFavorited: false,
        })
      })

    const events = (await Promise.all(eventsPromise)).filter(
      (event): event is EventDetails => event !== null,
    )

    return events.length > 0 ? events : []
  }

  async create(event: Event): Promise<void> {
    this.items.push(event)

    await this.eventImagesRepository.createMany(event.images.getItems())
  }

  async save(event: Event): Promise<void> {
    const index = this.items.findIndex((item) => item.id === event.id)

    this.items[index] = event

    await this.eventImagesRepository.createMany(event.images.getNewItems())
    await this.eventImagesRepository.deleteMany(event.images.getRemovedItems())
  }
}
