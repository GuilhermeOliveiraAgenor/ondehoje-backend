import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import type { Optional } from '@/core/types/optional'

export interface ParameterProps {
  key: string
  keyInfo: string
  value: string
  type: string
  status: boolean
  visible: boolean
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt?: Date | null
  updatedBy?: UniqueEntityID | null
}

export class Parameter extends Entity<ParameterProps> {
  get key() {
    return this.props.key
  }

  set key(key: string) {
    this.props.key = key
    this.touch()
  }

  get keyInfo() {
    return this.props.keyInfo
  }

  set keyInfo(keyInfo: string) {
    this.props.keyInfo = keyInfo
    this.touch()
  }

  get value() {
    return this.props.value
  }

  set value(value: string) {
    this.props.value = value
    this.touch()
  }

  get type() {
    return this.props.type
  }

  set type(type: string) {
    this.props.type = type
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: boolean) {
    this.props.status = status
    this.touch()
  }

  get visible() {
    return this.props.visible
  }

  set visible(visible: boolean) {
    this.props.visible = visible
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

  set updatedBy(updatedBy: UniqueEntityID | undefined | null) {
    this.props.updatedBy = updatedBy
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ParameterProps, 'createdAt' | 'updatedAt' | 'updatedBy'>,
    id?: UniqueEntityID,
  ) {
    const parameter = new Parameter(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
        updatedBy: props.updatedBy ?? null,
      },
      id,
    )

    return parameter
  }
}
