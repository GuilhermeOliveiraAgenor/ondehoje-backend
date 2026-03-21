import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

import { CompanyDocumentList } from './company-document-list'
import { CompanyImageList } from './company-image-list'
import { Slug } from './value-objects/slug'

export interface CompanyProps {
  addressId: UniqueEntityID
  name: string
  slug: Slug
  socialName: string
  status: string
  document: string
  documents: CompanyDocumentList
  images: CompanyImageList
  createdAt: Date
  createdBy: UniqueEntityID
  updatedAt?: Date | null
  updatedBy?: UniqueEntityID | null
}

export class Company extends Entity<CompanyProps> {
  get addressId() {
    return this.props.addressId
  }

  set addressId(addressId: UniqueEntityID) {
    this.props.addressId = addressId
    this.touch()
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  set slug(slug: Slug) {
    this.props.slug = slug
    this.touch()
  }

  get socialName() {
    return this.props.socialName
  }

  set socialName(socialName: string) {
    this.props.socialName = socialName
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: string) {
    this.props.status = status
    this.touch()
  }

  get document() {
    return this.props.document
  }

  set document(document: string) {
    this.props.document = document
    this.touch()
  }

  get documents() {
    return this.props.documents
  }

  set documents(documents: CompanyDocumentList) {
    this.props.documents = documents
    this.touch()
  }

  get images() {
    return this.props.images
  }

  set images(images: CompanyImageList) {
    this.props.images = images
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
    props: Optional<
      CompanyProps,
      'slug' | 'documents' | 'images' | 'createdAt' | 'updatedAt' | 'updatedBy'
    >,
    id?: UniqueEntityID,
  ) {
    const company = new Company(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.name),
        documents: props.documents ?? new CompanyDocumentList(),
        images: props.images ?? new CompanyImageList(),
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? null,
        updatedBy: props.updatedBy ?? null,
      },
      id,
    )

    return company
  }
}
