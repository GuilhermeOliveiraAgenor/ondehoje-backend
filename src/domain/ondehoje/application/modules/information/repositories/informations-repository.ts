import { Information } from '@/domain/ondehoje/enterprise/entities/information'

export abstract class InformationsRepository {
  abstract findById(id: string): Promise<Information | null>
  abstract findManyByEventId(eventId: string): Promise<Information[]>
  abstract findManyByCompanyId(companyId: string): Promise<Information[]>
  abstract createMany(informations: Information[]): Promise<void>
  abstract save(information: Information): Promise<void>
  abstract delete(information: Information): Promise<void>
}
