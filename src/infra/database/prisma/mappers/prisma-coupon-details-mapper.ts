import {
  Address as PrismaAddress,
  Category as PrismaCategory,
  Company as PrismaCompany,
  CompanyDocument as PrismaCompanyDocument,
  CompanyImage as PrismaCompanyImage,
  Coupon as PrismaCoupon,
  Document as PrismaDocument,
  Event as PrismaEvent,
  EventImage as PrismaEventImage,
  Image as PrismaImage,
  Information as PrismaInformation,
} from '@prisma/client'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CouponDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/coupon-details'

import { PrismaEventDetailsMapper } from './prisma-event-details-mapper'

type PrismaCouponDetails = PrismaCoupon & {
  event: PrismaEvent & {
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
  }
  isRedeemed: boolean
}

export class PrismaCouponDetailsMapper {
  static toDomain(raw: PrismaCouponDetails): CouponDetails {
    return CouponDetails.create({
      id: new UniqueEntityID(raw.id),
      event: PrismaEventDetailsMapper.toDomain(raw.event),
      name: raw.name,
      description: raw.description,
      expiresAt: raw.expiresAt,
      createdAt: raw.createdAt,
      createdBy: new UniqueEntityID(raw.createdBy),
      updatedAt: raw.updatedAt,
      updatedBy: raw.updatedBy ? new UniqueEntityID(raw.updatedBy) : null,
      isRedeemed: raw.isRedeemed,
    })
  }
}
