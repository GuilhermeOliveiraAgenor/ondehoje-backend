import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import { SubscriptionsRepository } from '@/domain/ondehoje/application/modules/subscription/repositories/subscriptions-repository'
import { Subscription } from '@/domain/ondehoje/enterprise/entities/subscription'

import { PrismaSubscriptionMapper } from '../mappers/prisma-subscription-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaSubscriptionsRepository implements SubscriptionsRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Subscription | null> {
    const [subscription] = await this.prisma.$transaction([
      this.prisma.subscription.findFirst({
        where: {
          id,
        },
      }),
    ])

    if (!subscription) {
      return null
    }

    return PrismaSubscriptionMapper.toDomain(subscription)
  }

  async findByCompanyId(companyId: string): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        companyId,
      },
    })

    if (!subscription) {
      return null
    }

    return PrismaSubscriptionMapper.toDomain(subscription)
  }

  async create(subscription: Subscription): Promise<void> {
    const data = PrismaSubscriptionMapper.toPersistency(subscription)

    await this.prisma.$transaction([
      this.prisma.subscription.create({
        data,
      }),
    ])
  }

  async save(subscription: Subscription): Promise<void> {
    const data = PrismaSubscriptionMapper.toPersistency(subscription)

    await this.prisma.$transaction([
      this.prisma.subscription.update({
        where: {
          id: subscription.id.toString(),
        },
        data,
      }),
    ])

    DomainEvents.dispatchEventsForAggregate(subscription.id)
  }
}
