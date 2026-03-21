import { Advertisement } from '@/domain/ondehoje/enterprise/entities/advertisement'
import { AdvertisementDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/advertisement-details'

export abstract class AdvertisementsRepository {
  abstract findById(id: string): Promise<Advertisement | null>
  abstract findFirstByCompanyId(
    companyId: string,
  ): Promise<Advertisement | null>

  abstract findFirstByEventId(eventId: string): Promise<Advertisement | null>
  abstract findManyByCompanyId(
    companyId: string,
  ): Promise<AdvertisementDetails[]>

  abstract findManyByEventId(eventId: string): Promise<AdvertisementDetails[]>
  abstract findManyByOwnerId(ownerId: string): Promise<AdvertisementDetails[]>

  abstract create(advertisement: Advertisement): Promise<void>
  abstract save(advertisement: Advertisement): Promise<void>
}
