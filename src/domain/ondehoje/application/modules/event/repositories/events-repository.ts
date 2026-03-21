import { Event } from '@/domain/ondehoje/enterprise/entities/event'
import { EventDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/event-details'

export interface FindManyEventsParams {
  latitude?: number
  longitude?: number
}

export abstract class EventsRepository {
  abstract findById(id: string): Promise<Event | null>
  abstract findDetails(slug: string): Promise<EventDetails | null>
  abstract findBySlugAndCompanyId(
    slug: string,
    companyId: string,
  ): Promise<Event | null>

  abstract findManyByCompanyId(companyId: string): Promise<EventDetails[]>
  abstract findMany(params?: FindManyEventsParams): Promise<EventDetails[]>
  abstract findManyForUser(
    userId: string,
    params?: FindManyEventsParams,
  ): Promise<EventDetails[]>

  abstract create(event: Event): Promise<void>
  abstract save(event: Event): Promise<void>
}
