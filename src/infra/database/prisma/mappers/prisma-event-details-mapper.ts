import {
  Address as PrismaAddress,
  Category as PrismaCategory,
  Company as PrismaCompany,
  CompanyDocument as PrismaCompanyDocument,
  CompanyImage as PrismaCompanyImage,
  Document as PrismaDocument,
  Event as PrismaEvent,
  EventImage as PrismaEventImage,
  Image as PrismaImage,
  Information as PrismaInformation,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EventDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/event-details'
import { Slug } from '@/domain/ondehoje/enterprise/entities/value-objects/slug'

import { PrismaAddressMapper } from './prisma-address-mapper'
import { PrismaCategoryMapper } from './prisma-category-mapper'
import { PrismaCompanyDetailsMapper } from './prisma-company-details-mapper'
import { PrismaImageMapper } from './prisma-image-mapper'
import { PrismaInformationMapper } from './prisma-information-mapper'

type PrismaEventDetails = PrismaEvent & {
  company: PrismaCompany & {
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
  address: PrismaAddress
  category: PrismaCategory
  informations: PrismaInformation[]
  eventImages: (PrismaEventImage & {
    image: PrismaImage
  })[]
  isFavorited?: boolean
}

export class PrismaEventDetailsMapper {
  static toDomain(raw: PrismaEventDetails): EventDetails {
    return EventDetails.create({
      id: new UniqueEntityID(raw.id),
      name: raw.name,
      slug: Slug.createFromText(raw.slug),
      description: raw.description,
      startDate: raw.startDate,
      endDate: raw.endDate,
      createdAt: raw.createdAt,
      createdBy: new UniqueEntityID(raw.createdBy),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy ? new UniqueEntityID(raw.updatedBy) : null,
      deletedAt: raw.deletedAt,
      deletedBy: raw.deletedBy ? new UniqueEntityID(raw.deletedBy) : null,
      company: PrismaCompanyDetailsMapper.toDomain(raw.company),
      address: PrismaAddressMapper.toDomain(raw.address),
      category: PrismaCategoryMapper.toDomain(raw.category),
      informations: raw.informations.map((information) =>
        PrismaInformationMapper.toDomain(information),
      ),
      images: raw.eventImages.map((raw) =>
        PrismaImageMapper.toDomain(raw.image),
      ),
      isFavorited: raw.isFavorited ?? false,
    })
  }
}
