import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface EventImageProps {
  eventId: UniqueEntityID
  imageId: UniqueEntityID
}

export class EventImage extends Entity<EventImageProps> {
  get eventId() {
    return this.props.eventId
  }

  set eventId(eventId: UniqueEntityID) {
    this.props.eventId = eventId
  }

  get imageId() {
    return this.props.imageId
  }

  set imageId(imageId: UniqueEntityID) {
    this.props.imageId = imageId
  }

  static create(props: EventImageProps, id?: UniqueEntityID) {
    const eventImage = new EventImage(props, id)

    return eventImage
  }
}
