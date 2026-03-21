import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface DocumentTypeProps {
  name: string
  description?: string | null
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt?: Date | null
  updatedBy?: UniqueEntityID | null
}

export class DocumentType extends Entity<DocumentTypeProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string | null | undefined) {
    this.props.description = description
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get createdBy() {
    return this.props.createdBy
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get updatedBy() {
    return this.props.updatedBy
  }

  set createdBy(createdBy: UniqueEntityID) {
    this.props.createdBy = createdBy
    this.touch()
  }

  set updatedBy(updatedBy: UniqueEntityID | null | undefined) {
    this.props.updatedBy = updatedBy
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<DocumentTypeProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    const companyType = new DocumentType(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? props.createdAt,
      },
      id,
    )

    return companyType
  }
}
