import { InformationsRepository } from '@/domain/ondehoje/application/modules/information/repositories/informations-repository'
import { Information } from '@/domain/ondehoje/enterprise/entities/information'

export class InMemoryInformationsRepository implements InformationsRepository {
  public items: Information[] = []

  async findById(id: string): Promise<Information | null> {
    const information = this.items.find((item) => item.id.toString() === id)

    if (!information) {
      return null
    }

    return information
  }

  async findManyByEventId(eventId: string): Promise<Information[]> {
    const informations = this.items.filter(
      (item) => item.eventId?.toString() === eventId,
    )

    return informations
  }

  async findManyByCompanyId(companyId: string): Promise<Information[]> {
    const informations = this.items.filter(
      (item) => item.companyId?.toString() === companyId,
    )

    return informations
  }

  async createMany(informations: Information[]): Promise<void> {
    this.items.push(...informations)
  }

  async save(information: Information): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === information.id)
    this.items[itemIndex] = information
  }

  async delete(information: Information): Promise<void> {
    const informationId = this.items.filter(
      (item) => item.id === information.id,
    )
    this.items = informationId
  }
}
