import {
  Address as PrismaAddress,
  Company as PrismaCompany,
  CompanyDocument as PrismaCompanyDocument,
  CompanyImage as PrismaCompanyImage,
  Document as PrismaDocument,
  Image as PrismaImage,
  Information as PrismaInformation,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CompanyDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/company-details'
import { Slug } from '@/domain/ondehoje/enterprise/entities/value-objects/slug'

import { PrismaAddressMapper } from './prisma-address-mapper'
import { PrismaDocumentMapper } from './prisma-document-mapper'
import { PrismaImageMapper } from './prisma-image-mapper'
import { PrismaInformationMapper } from './prisma-information-mapper'

type PrismaCompanyDetails = PrismaCompany & {
  address: PrismaAddress
  companyDocuments: (PrismaCompanyDocument & {
    document: PrismaDocument
  })[]
  companyImages: (PrismaCompanyImage & {
    image: PrismaImage
  })[]
  informations: PrismaInformation[]
  isFavorited?: boolean
}

export class PrismaCompanyDetailsMapper {
  static toDomain(raw: PrismaCompanyDetails): CompanyDetails {
    return CompanyDetails.create({
      id: new UniqueEntityID(raw.id),
      name: raw.name,
      slug: Slug.createFromText(raw.slug),
      socialName: raw.socialName,
      status: raw.status,
      document: raw.document,
      createdAt: raw.createdAt,
      createdBy: new UniqueEntityID(raw.createdBy),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy ? new UniqueEntityID(raw.updatedBy) : null,
      address: PrismaAddressMapper.toDomain(raw.address),
      documents: raw.companyDocuments.map((raw) =>
        PrismaDocumentMapper.toDomain(raw.document),
      ),
      images: raw.companyImages.map((raw) =>
        PrismaImageMapper.toDomain(raw.image),
      ),
      informations: raw.informations.map((information) =>
        PrismaInformationMapper.toDomain(information),
      ),
      isFavorited: raw.isFavorited ?? false,
    })
  }
}
