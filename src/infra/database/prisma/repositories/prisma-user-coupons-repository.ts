import { Injectable } from '@nestjs/common'

import { UserCouponsRepository } from '@/domain/ondehoje/application/modules/user-coupon/repositories/user-coupons-repository'
import { UserCoupon } from '@/domain/ondehoje/enterprise/entities/user-coupon'
import type { UserCouponDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/user-coupon-details'

import { PrismaUserCouponDetailsMapper } from '../mappers/prisma-user-coupon-details-mapper'
import { PrismaUserCouponMapper } from '../mappers/prisma-user-coupon-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaUserCouponsRepository implements UserCouponsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<UserCoupon | null> {
    const [userCoupon] = await this.prisma.$transaction([
      this.prisma.userCoupon.findFirst({
        where: {
          id,
        },
      }),
    ])

    if (!userCoupon) {
      return null
    }

    return PrismaUserCouponMapper.toDomain(userCoupon)
  }

  async findManyByUserId(userId: string): Promise<UserCouponDetails[]> {
    const userCoupons = await this.prisma.userCoupon.findMany({
      where: {
        userId,
        AND: {
          usedAt: null,
        },
      },
      include: {
        coupon: {
          include: {
            event: {
              include: {
                company: {
                  include: {
                    address: true,
                    companyDocuments: {
                      include: {
                        document: true,
                      },
                    },
                    companyImages: {
                      include: {
                        image: true,
                      },
                    },
                    informations: {
                      where: {
                        eventId: null,
                      },
                    },
                  },
                },
                address: true,
                category: true,
                informations: true,
                eventImages: {
                  include: {
                    image: true,
                  },
                },
              },
            },
            userCoupons: {
              where: {
                userId,
              },
            },
          },
        },
      },
    })

    return userCoupons.map((event) =>
      PrismaUserCouponDetailsMapper.toDomain({
        ...event,
        coupon: {
          ...event.coupon,
          isRedeemed: event.coupon.userCoupons.length > 0,
        },
      }),
    )
  }

  async create(userCoupon: UserCoupon): Promise<void> {
    const data = PrismaUserCouponMapper.toPersistency(userCoupon)

    await this.prisma.$transaction([
      this.prisma.userCoupon.create({
        data,
      }),
    ])
  }

  async save(userCoupon: UserCoupon): Promise<void> {
    const data = PrismaUserCouponMapper.toPersistency(userCoupon)

    await this.prisma.$transaction([
      this.prisma.userCoupon.update({
        where: {
          id: userCoupon.id.toString(),
        },
        data,
      }),
    ])
  }

  async delete(userCoupon: UserCoupon): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.userCoupon.delete({
        where: {
          id: userCoupon.id.toString(),
        },
      }),
    ])
  }
}
