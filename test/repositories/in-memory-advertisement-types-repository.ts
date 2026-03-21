import { AdvertisementTypesRepository } from '@/domain/ondehoje/application/modules/advertisement-type/repositories/advertisement-types-repository'
import { AdvertisementType } from '@/domain/ondehoje/enterprise/entities/advertisement-type'

export class InMemoryAdvertisementTypesRepository
  implements AdvertisementTypesRepository
{
  public items: AdvertisementType[] = []

  async findById(id: string): Promise<AdvertisementType | null> {
    const advertisementType = this.items.find(
      (item) => item.id.toString() === id,
    )

    if (!advertisementType) {
      return null
    }

    return advertisementType
  }

  async findByName(name: string): Promise<AdvertisementType | null> {
    const advertisementType = this.items.find((item) => item.name === name)

    if (!advertisementType) {
      return null
    }

    return advertisementType
  }

  async findMany(): Promise<AdvertisementType[]> {
    return this.items
  }

  async create(advertisementType: AdvertisementType): Promise<void> {
    this.items.push(advertisementType)
  }

  async save(advertisementType: AdvertisementType): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.name === advertisementType.name,
    )

    this.items[itemIndex] = advertisementType
  }
}
