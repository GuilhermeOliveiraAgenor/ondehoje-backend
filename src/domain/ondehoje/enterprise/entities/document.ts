import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface DocumentProps {
  documentTypeId: UniqueEntityID
  file: string
  name: string
  description?: string | null
  expiresAt?: Date | null
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt?: Date | null
  updatedBy?: UniqueEntityID | null
}

export class Document extends Entity<DocumentProps> {
  get documentTypeId() {
    return this.props.documentTypeId
  }

  set documentTypeId(documentTypeId: UniqueEntityID) {
    this.props.documentTypeId = documentTypeId
    this.touch()
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get file() {
    return this.props.file
  }

  set file(file: string) {
    this.props.file = file
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string | undefined | null) {
    this.props.description = description
    this.touch()
  }

  get expiresAt() {
    return this.props.expiresAt
  }

  set expiresAt(expiresAt: Date | undefined | null) {
    this.props.expiresAt = expiresAt
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get createdBy() {
    return this.props.createdBy
  }

  set createdBy(createdBy: UniqueEntityID) {
    this.props.createdBy = createdBy
    this.touch()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get updatedBy() {
    return this.props.updatedBy
  }

  set updatedBy(updatedBy: UniqueEntityID | null | undefined) {
    this.props.updatedBy = updatedBy
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<DocumentProps, 'expiresAt' | 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    const document = new Document(
      {
        ...props,
        expiresAt: props.expiresAt ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? props.createdAt,
      },
      id,
    )

    return document
  }
}
