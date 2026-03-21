import { AdvertisementAuthorization } from '@/domain/ondehoje/enterprise/entities/advertisement-authorization'

export abstract class AdvertisementAuthorizationsRepository {
  abstract findById(id: string): Promise<AdvertisementAuthorization | null>
  abstract findManyByAdvertisementId(
    advertisementId: string,
  ): Promise<AdvertisementAuthorization[]>

  abstract create(
    advertisementAuthorization: AdvertisementAuthorization,
  ): Promise<void>
}
