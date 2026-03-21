import { WatchedList } from '@/core/entities/watched-list'

import { EventImage } from './event-image'

export class EventImageList extends WatchedList<EventImage> {
  compareItems(a: EventImage, b: EventImage): boolean {
    return a.eventId.equals(b.eventId) && a.imageId.equals(b.imageId)
  }
}
