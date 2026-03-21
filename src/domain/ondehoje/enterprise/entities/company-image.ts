import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface CompanyImageProps {
  companyId: UniqueEntityID
  imageId: UniqueEntityID
}

export class CompanyImage extends Entity<CompanyImageProps> {
  get companyId() {
    return this.props.companyId
  }

  set companyId(companyId: UniqueEntityID) {
    this.props.companyId = companyId
  }

  get imageId() {
    return this.props.imageId
  }

  set imageId(imageId: UniqueEntityID) {
    this.props.imageId = imageId
  }

  static create(props: CompanyImageProps, id?: UniqueEntityID) {
    const companyImage = new CompanyImage(props, id)

    return companyImage
  }
}
