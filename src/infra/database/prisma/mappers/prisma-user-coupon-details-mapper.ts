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
  UserCoupon as PrismaUserCoupon,
} from '@prisma/client'

import { UserCouponDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/user-coupon-details'

import { PrismaCouponDetailsMapper } from './prisma-coupon-details-mapper'

type PrismaUserCouponDetails = PrismaUserCoupon & {
  coupon: PrismaCoupon & {
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
}

export class PrismaUserCouponDetailsMapper {
  static toDomain(raw: PrismaUserCouponDetails): UserCouponDetails {
    return UserCouponDetails.create({
      coupon: PrismaCouponDetailsMapper.toDomain(raw.coupon),
      hash: raw.hash,
      usedAt: raw.usedAt,
      createdAt: raw.createdAt,
    })
  }
}
