import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface AddressProps {
  street: string
  complement?: string | null
  neighborhood: string
  number: string
  cep: string
  city: string
  state: string
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt?: Date | null
  updatedBy?: UniqueEntityID | null
  longitude: number
  latitude: number
}

export class Address extends Entity<AddressProps> {
  get street() {
    return this.props.street
  }

  set street(street: string) {
    this.props.street = street
    this.touch()
  }

  get complement() {
    return this.props.complement || null
  }

  set complement(complement: string | null) {
    this.props.complement = complement
    this.touch()
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood
    this.touch()
  }

  get number() {
    return this.props.number
  }

  set number(number: string) {
    this.props.number = number
    this.touch()
  }

  get cep() {
    return this.props.cep
  }

  set cep(cep: string) {
    this.props.cep = cep
    this.touch()
  }

  get city() {
    return this.props.city
  }

  set city(city: string) {
    this.props.city = city
    this.touch()
  }

  get state() {
    return this.props.state
  }

  set state(state: string) {
    this.props.state = state
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get createdBy() {
    return this.props.createdBy
  }

  set createdBy(createBy: UniqueEntityID) {
    this.props.createdBy = createBy
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

  get longitude() {
    return this.props.longitude
  }

  set longitude(longitude: number) {
    this.props.longitude = longitude
    this.touch()
  }

  get latitude() {
    return this.props.latitude
  }

  set latitude(latitude: number) {
    this.props.latitude = latitude
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<AddressProps, 'createdAt' | 'updatedAt' | 'updatedBy'>,
    id?: UniqueEntityID,
  ) {
    const address = new Address(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? props.createdAt,
        updatedBy: props.updatedBy ?? null,
      },
      id,
    )

    return address
  }
}
