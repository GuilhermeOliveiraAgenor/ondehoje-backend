import { DomainEvents } from '@/core/events/domain-events'
import { AdvertisementsRepository } from '@/domain/ondehoje/application/modules/advertisement/repositories/advertisements-repository'
import { Advertisement } from '@/domain/ondehoje/enterprise/entities/advertisement'
import { AdvertisementDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/advertisement-details'

import type { InMemoryAdvertisementAuthorizationsRepository } from './in-memory-advertisement-authorizations-repository'
import { InMemoryCompaniesRepository } from './in-memory-companies-repository'
import { InMemoryEventsRepository } from './in-memory-events-repository'

export class InMemoryAdvertisementsRepository
  implements AdvertisementsRepository
{
  public items: Advertisement[] = []

  constructor(
    private companiesRepository: InMemoryCompaniesRepository,
    private eventsRepository: InMemoryEventsRepository,
    private advertisementAuthorizationsRepository: InMemoryAdvertisementAuthorizationsRepository,
  ) {}

  async findById(id: string): Promise<Advertisement | null> {
    const advertisement = this.items.find((item) => item.id.toString() === id)

    if (!advertisement) {
      return null
    }

    return advertisement
  }

  async findFirstByCompanyId(companyId: string): Promise<Advertisement | null> {
    const advertisement = this.items.find(
      (item) =>
        item.companyId.toString() === companyId && item.eventId === null,
    )

    if (!advertisement) {
      return null
    }

    return advertisement
  }

  async findFirstByEventId(eventId: string): Promise<Advertisement | null> {
    const advertisement = this.items.find(
      (item) => item.eventId?.toString() === eventId,
    )

    if (!advertisement) {
      return null
    }

    return advertisement
  }

  async findManyByCompanyId(
    companyId: string,
  ): Promise<AdvertisementDetails[]> {
    const advertisements = this.items
      .filter(
        (item) =>
          item.companyId?.toString() === companyId && item.deletedAt === null,
      )
      .map((advertisement) => {
        const company = this.companiesRepository.items.find(
          (company) =>
            company.id.toString() === advertisement.companyId?.toString(),
        )

        if (!company) {
          throw new Error('Company not found')
        }

        const event =
          this.eventsRepository.items.find(
            (event) =>
              event.id.toString() === advertisement.eventId?.toString(),
          ) || null

        const advertisementAuthorizations =
          this.advertisementAuthorizationsRepository.items.filter(
            (authorization) =>
              authorization.advertisementId.toString() ===
              advertisement.id.toString(),
          )

        return AdvertisementDetails.create({
          id: advertisement.id,
          company,
          event,
          description: advertisement.description,
          days: advertisement.days,
          amount: advertisement.amount,
          clicks: advertisement.clicks,
          insights: advertisement.insights,
          status: advertisement.status,
          expirationDate: advertisement.expirationDate,
          advertisementAuthorizations,
          createdAt: advertisement.createdAt,
          createdBy: advertisement.createdBy,
          updatedAt: advertisement.updatedAt,
          updatedBy: advertisement.updatedBy,
        })
      })

    return advertisements
  }

  async findManyByEventId(eventId: string): Promise<AdvertisementDetails[]> {
    const advertisements = this.items
      .filter(
        (item) =>
          item.eventId?.toString() === eventId && item.deletedAt === null,
      )
      .map((advertisement) => {
        const company = this.companiesRepository.items.find(
          (company) =>
            company.id.toString() === advertisement.companyId?.toString(),
        )

        if (!company) {
          throw new Error('Company not found')
        }

        const event = this.eventsRepository.items.find(
          (event) => event.id.toString() === advertisement.eventId?.toString(),
        )

        if (!event) {
          throw new Error('Event not found')
        }

        const advertisementAuthorizations =
          this.advertisementAuthorizationsRepository.items.filter(
            (authorization) =>
              authorization.advertisementId.toString() ===
              advertisement.id.toString(),
          )

        return AdvertisementDetails.create({
          id: advertisement.id,
          company,
          event,
          description: advertisement.description,
          days: advertisement.days,
          amount: advertisement.amount,
          clicks: advertisement.clicks,
          insights: advertisement.insights,
          status: advertisement.status,
          expirationDate: advertisement.expirationDate,
          advertisementAuthorizations,
          createdAt: advertisement.createdAt,
          createdBy: advertisement.createdBy,
          updatedAt: advertisement.updatedAt,
          updatedBy: advertisement.updatedBy,
        })
      })

    return advertisements
  }

  async findManyByOwnerId(ownerId: string): Promise<AdvertisementDetails[]> {
    const advertisements = this.items
      .filter((item) => item.deletedAt === null)
      .filter((advertisement) => {
        const company = this.companiesRepository.items.find(
          (company) =>
            company.id.toString() === advertisement.companyId?.toString(),
        )

        if (!company) {
          throw new Error('Company not found')
        }

        return company.createdBy.toString() === ownerId
      })
      .map((advertisement) => {
        const company = this.companiesRepository.items.find(
          (company) =>
            company.id.toString() === advertisement.companyId?.toString(),
        )

        if (!company) {
          throw new Error('Company not found')
        }

        const event =
          this.eventsRepository.items.find(
            (event) =>
              event.id.toString() === advertisement.eventId?.toString(),
          ) || null

        const advertisementAuthorizations =
          this.advertisementAuthorizationsRepository.items.filter(
            (authorization) =>
              authorization.advertisementId.toString() ===
              advertisement.id.toString(),
          )

        return AdvertisementDetails.create({
          id: advertisement.id,
          company,
          event,
          description: advertisement.description,
          days: advertisement.days,
          amount: advertisement.amount,
          clicks: advertisement.clicks,
          insights: advertisement.insights,
          status: advertisement.status,
          expirationDate: advertisement.expirationDate,
          advertisementAuthorizations,
          createdAt: advertisement.createdAt,
          createdBy: advertisement.createdBy,
          updatedAt: advertisement.updatedAt,
          updatedBy: advertisement.updatedBy,
        })
      })

    return advertisements
  }

  async create(advertisement: Advertisement): Promise<void> {
    this.items.push(advertisement)

    DomainEvents.dispatchEventsForAggregate(advertisement.id)
  }

  async save(advertisement: Advertisement): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === advertisement.id,
    )

    this.items[itemIndex] = advertisement
  }
}
