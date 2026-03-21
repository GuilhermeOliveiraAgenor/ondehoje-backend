import { CompanyDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/company-details'

import { AddressPresenter } from '../../address/presenters/address-presenter'
import { InformationPresenter } from '../../information/presenters/information-presenter'
import { ImagePresenter } from '../../upload/presenters/image-presenter'

export class CompanyDetailsPresenter {
  static toHTTP(raw: CompanyDetails) {
    return {
      id: raw.id.toString(),
      name: raw.name,
      socialName: raw.socialName,
      slug: raw.slug.value,
      status: raw.status,
      document: raw.document,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
      address: AddressPresenter.toHTTP(raw.address),
      documents: raw.documents.map((document) => ({
        id: document.id.toString(),
        documentTypeId: document.documentTypeId.toString(),
        name: document.name,
        file: `${process.env.AWS_BUCKET_PUBLIC_URL}/${document.file}`,
        description: document.description,
        expiresAt: document.expiresAt,
        createdAt: document.createdAt,
      })),
      images: raw.images.map((image) => ImagePresenter.toHTTP(image)),
      informations: raw.informations.map((information) =>
        InformationPresenter.toHTTP(information),
      ),
      isFavorited: raw.isFavorited,
    }
  }
}
