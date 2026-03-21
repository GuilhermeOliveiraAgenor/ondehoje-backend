import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface FavoriteProps {
  eventId?: UniqueEntityID | null
  companyId?: UniqueEntityID | null
  userId: UniqueEntityID
  createdAt: Date
}

export class Favorite extends Entity<FavoriteProps> {
  get eventId() {
    return this.props.eventId
  }

  set eventId(eventId: UniqueEntityID | null | undefined) {
    this.props.eventId = eventId
  }

  get companyId() {
    return this.props.companyId
  }

  set companyId(companyId: UniqueEntityID | null | undefined) {
    this.props.companyId = companyId
  }

  get userId() {
    return this.props.userId
  }

  set userId(userId: UniqueEntityID) {
    this.props.userId = userId
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<FavoriteProps, 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const favorite = new Favorite(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return favorite
  }
}
