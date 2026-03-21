import { DomainEvents } from '@/core/events/domain-events'
import { AdvertisementAuthorizationsRepository } from '@/domain/ondehoje/application/modules/advertisement-authorization/repositories/advertisement-authorizations-repository'
import { AdvertisementAuthorization } from '@/domain/ondehoje/enterprise/entities/advertisement-authorization'

export class InMemoryAdvertisementAuthorizationsRepository
  implements AdvertisementAuthorizationsRepository
{
  public items: AdvertisementAuthorization[] = []

  async findById(id: string): Promise<AdvertisementAuthorization | null> {
    const advertisementAuthorization = this.items.find(
      (item) => item.id.toString() === id,
    )

    if (!advertisementAuthorization) {
      return null
    }

    return advertisementAuthorization
  }

  async findManyByAdvertisementId(
    advertisementId: string,
  ): Promise<AdvertisementAuthorization[]> {
    const advertisementAuthorizations = this.items.filter(
      (item) => item.advertisementId.toString() === advertisementId,
    )

    return advertisementAuthorizations
  }

  async create(
    advertisementAuthorization: AdvertisementAuthorization,
  ): Promise<void> {
    this.items.push(advertisementAuthorization)

    DomainEvents.dispatchEventsForAggregate(advertisementAuthorization.id)
  }
}
