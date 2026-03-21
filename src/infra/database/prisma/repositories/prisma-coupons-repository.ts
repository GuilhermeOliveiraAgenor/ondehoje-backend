import { Injectable } from '@nestjs/common'

import { CouponsRepository } from '@/domain/ondehoje/application/modules/coupon/repositories/coupons-repository'
import { Coupon } from '@/domain/ondehoje/enterprise/entities/coupon'
import type { CouponDetails } from '@/domain/ondehoje/enterprise/entities/value-objects/coupon-details'

import { PrismaCouponDetailsMapper } from '../mappers/prisma-coupon-details-mapper'
import { PrismaCouponMapper } from '../mappers/prisma-coupon-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCouponsRepository implements CouponsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Coupon | null> {
    const [coupon] = await this.prisma.$transaction([
      this.prisma.coupon.findUnique({
        where: {
          id,
        },
      }),
    ])

    if (!coupon) {
      return null
    }

    return PrismaCouponMapper.toDomain(coupon)
  }

  async findByNameAndEventId(
    name: string,
    eventId: string,
  ): Promise<Coupon | null> {
    const [coupon] = await this.prisma.$transaction([
      this.prisma.coupon.findUnique({
        where: {
          name_eventId: {
            name,
            eventId,
          },
        },
      }),
    ])

    if (!coupon) {
      return null
    }

    return PrismaCouponMapper.toDomain(coupon)
  }

  async findManyByCompanyId(companyId: string): Promise<CouponDetails[]> {
    const coupons = await this.prisma.coupon.findMany({
      where: {
        event: {
          companyId,
        },
      },
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
        userCoupons: true,
      },
    })

    return coupons.map((event) =>
      PrismaCouponDetailsMapper.toDomain({
        ...event,
        isRedeemed: false,
      }),
    )
  }

  async findManyByEventId(
    eventId: string,
    userId: string,
  ): Promise<CouponDetails[]> {
    const coupons = await this.prisma.coupon.findMany({
      where: {
        eventId,
      },
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
    })

    return coupons.map((event) =>
      PrismaCouponDetailsMapper.toDomain({
        ...event,
        isRedeemed: event.userCoupons.length > 0,
      }),
    )
  }

  async create(coupon: Coupon): Promise<void> {
    const data = PrismaCouponMapper.toPersistency(coupon)

    await this.prisma.$transaction([
      this.prisma.coupon.create({
        data,
      }),
    ])
  }

  async save(coupon: Coupon): Promise<void> {
    const data = PrismaCouponMapper.toPersistency(coupon)

    await this.prisma.$transaction([
      this.prisma.coupon.update({
        where: {
          id: coupon.id.toString(),
        },
        data,
      }),
    ])
  }

  async delete(coupon: Coupon): Promise<void> {
    const data = PrismaCouponMapper.toPersistency(coupon)

    await this.prisma.$transaction([
      this.prisma.coupon.update({
        where: {
          id: coupon.id.toString(),
        },
        data: {
          deletedAt: new Date(),
          deletedBy: data.deletedBy,
        },
      }),
    ])
  }
}
