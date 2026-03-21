import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface ImageProps {
  url: string
  alt?: string | null
  createdAt: Date
}

export class Image extends Entity<ImageProps> {
  get url() {
    return this.props.url
  }

  set url(url: string) {
    this.props.url = url
  }

  get alt() {
    return this.props.alt
  }

  set alt(alt: string | undefined | null) {
    this.props.alt = alt
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: Optional<ImageProps, 'createdAt'>, id?: UniqueEntityID) {
    const image = new Image(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return image
  }
}
