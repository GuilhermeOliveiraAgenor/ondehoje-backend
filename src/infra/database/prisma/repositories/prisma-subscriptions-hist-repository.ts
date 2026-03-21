import { Injectable } from '@nestjs/common'

import { SubscriptionsHistRepository } from '@/domain/ondehoje/application/modules/subscription/modules/hist/repositories/subscriptions-hist-repository'
import { SubscriptionHist } from '@/domain/ondehoje/enterprise/entities/subscription-hist'

import { PrismaSubscriptionHistMapper } from '../mappers/prisma-subscription-hist-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaSubscriptionsHistRepository
  implements SubscriptionsHistRepository
{
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<SubscriptionHist | null> {
    const [subscriptionHist] = await this.prisma.$transaction([
      this.prisma.subscriptionHist.findUnique({
        where: {
          id,
        },
      }),
    ])

    if (!subscriptionHist) {
      return null
    }

    return PrismaSubscriptionHistMapper.toDomain(subscriptionHist)
  }

  async findManyByCompanyId(companyId: string): Promise<SubscriptionHist[]> {
    const [subscriptionsHist] = await this.prisma.$transaction([
      this.prisma.subscriptionHist.findMany({
        where: {
          companyId,
        },
      }),
    ])

    return subscriptionsHist.map(PrismaSubscriptionHistMapper.toDomain)
  }
}
