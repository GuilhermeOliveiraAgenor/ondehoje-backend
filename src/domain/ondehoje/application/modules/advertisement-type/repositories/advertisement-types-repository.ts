import { AdvertisementType } from '@/domain/ondehoje/enterprise/entities/advertisement-type'

export abstract class AdvertisementTypesRepository {
  abstract findById(id: string): Promise<AdvertisementType | null>
  abstract findByName(name: string): Promise<AdvertisementType | null>
  abstract findMany(): Promise<AdvertisementType[]>
  abstract create(advertisementType: AdvertisementType): Promise<void>
  abstract save(advertisementType: AdvertisementType): Promise<void>
}
